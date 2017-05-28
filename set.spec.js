const { expect } = require('chai');
const appCache = require('./index');

describe('AppCache::set', () => {

  afterEach(() => {
    appCache.delete('myKey');
  });

  it('Sets a value', () => {
    appCache.create('myKey', 'myValue');
    appCache.set('myKey', 'anotherValue');
    expect(appCache.get('myKey')).to.equal('anotherValue');
  });

  it('Emits set after setting the value', done => {
    let i = 0;

    appCache.once('set', (key, value) => {
      expect(i).to.equal(1); // the event is emitted after the return
      expect(key).to.equal('myKey');
      expect(value).to.equal('myValue');
      done();
    });

    appCache.create('myKey');
    appCache.set('myKey', 'myValue');

    expect(i++).to.equal(0);
    expect(appCache.get('myKey')).to.equal('myValue');
  });

  it('Returns a call to create if the key does not exist', done => {
    appCache.once('create', (key, value) => {
      expect(key).to.equal('myKey');
      expect(value).to.equal('myValue');
      done();
    });

    appCache.set('myKey', 'myValue');
  });

  it('Returns appCache', () => {
    appCache.create('myKey');
    expect(appCache.set('myKey', 'myValue')).to.equal(appCache);
  });

});
