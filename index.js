const EventEmitter = require('events').EventEmitter;
const cloneDeep = require('lodash/cloneDeep');
const pick = require('lodash/pick');
const { AppCacheKeyError } = require('./errors');

const cache = {};

const defaultOptions = {
  mutable: false,
  readOnly: false,
  validate: () => true
};

class AppCache extends EventEmitter {

  create (key, value, options = {}) {
    if (typeof cache[key] === 'object') {
      throw new AppCacheKeyError(`key ${key} already exists`);
    }

    if (typeof options === 'boolean') {
      options = { readOnly: options };
    }

    options = Object.assign({}, defaultOptions, options);

    let emitValue = value;
    if (typeof value === 'object' && !options.mutable) {
      options.value = cloneDeep(value);
      emitValue = cloneDeep(value);
    } else {
      options.value = value;
    }

    cache[key] = options;
    process.nextTick(() => this.emit('create', key, emitValue));
    return this;
  }

  delete (key) {
    if (typeof cache[key] === 'object') {
      delete cache[key];
      process.nextTick(() => this.emit('delete', key));
    }
    return this;
  }

  get (key) {
    if (typeof cache[key] !== 'object') {
      process.nextTick(() => this.emit('get', key, undefined));
      return undefined;
    }

    if (typeof cache[key].value === 'object' && !cache[key].mutable) {
      process.nextTick(() => this.emit('get', key, cloneDeep(cache[key].value)));
      return cloneDeep(cache[key].value);
    }

    process.nextTick(() => this.emit('get', key, cache[key].value));
    return cache[key].value;
  }

  getOptions (key) {
    if (typeof cache[key] !== 'object') {
      process.nextTick(() => this.emit('getOptions', key, null));
      return null;
    }

    const options = pick(cache[key], ['mutable', 'readOnly', 'validate']);

    process.nextTick(() => this.emit('getOptions', key, cloneDeep(options)));
    return cloneDeep(options);
  }

  set (key, value) {
    if (typeof cache[key] !== 'object') {
      return this.create(key, value);
    }

    if (cache[key].readOnly) {
      throw new TypeError(`Assignment to readOnly value ${key}`);
    }

    if (typeof cache[key].validate === 'function' && cache[key].validate(value) !== true) {
      return this;
    }

    let emitValue = value;
    if (typeof value === 'object' && !cache[key].mutable) {
      emitValue = cloneDeep(value);
      cache[key].value = cloneDeep(value);
    } else {
      cache[key].value = value;
    }

    process.nextTick(() => this.emit('set', key, emitValue));
    return this;
  }

}

const appCache = new AppCache();
appCache.setMaxListeners(Number.POSITIVE_INFINITY);

module.exports = appCache;
