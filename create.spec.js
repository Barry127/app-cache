const { expect } = require('chai');
const appCache = require('./index');
const { AppCacheKeyError } = require('./errors');

describe('AppCache::create', () => {

  afterEach(() => {
    appCache.delete('myKey');
  });

  it('Creates a value', () => {
    appCache.create('myKey', 'myValue');
    expect(appCache.get('myKey')).to.equal('myValue');
  });

  it('Emits create after creating a value', (done) => {
    let i = 0;

    appCache.once('create', (key, value) => {
      expect(i).to.equal(1); // the event is emitted after the return
      expect(key).to.equal('myKey');
      expect(value).to.equal('myValue');
      done();
    });

    appCache.create('myKey', 'myValue');
    expect(i++).to.equal(0);
  });

  it('Throws an AppCacheKeyError if a key already exists', () => {
    appCache.create('myKey');
    expect(appCache.create.bind(appCache, 'myKey')).to.throw(AppCacheKeyError);
  });

  it('Sets the default options of no options are specified', () => {
    appCache.create('myKey');
    const options = appCache.getOptions('myKey');

    expect(options.validate).to.be.a('function');
    delete options.validate; // cannot deep eql default validate function

    expect(options).to.eql({
      mutable: false,
      readOnly: false
    });
  });

  it('Sets the readOnly option if the options parameter is a boolean', () => {
    appCache.create('myKey', 'myValue', true);
    expect(appCache.getOptions('myKey').readOnly).to.be.true;
    expect(appCache.getOptions('myKey').mutable).to.be.false;
  });

  it('Sets the options if the options parameter is an object', () => {
    const myOptions = {
      mutable: true,
      readOnly: true,
      validate: () => false
    };
    appCache.create('myKey', 'myValue', myOptions);
    expect(appCache.getOptions('myKey')).to.eql(myOptions);
  });

  it('Returns appCache', () => {
    expect(appCache.create('myKey')).to.equal(appCache);
  });

});
