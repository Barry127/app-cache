const { expect } = require('chai');
const appCache = require('./index');

describe('AppCache::get', () => {

  afterEach(() => {
    appCache.delete('myKey');
  });

  it('Returns a value', () => {
    appCache.create('myKey', 'myValue');
    expect(appCache.get('myKey')).to.equal('myValue');
  });

  it('Returns undefined if the value is not in cache', () => {
    expect(appCache.get('notInCache')).to.be.undefined;
  });

  it('Emits get after getting a value', done => {
    let i = 0;

    appCache.once('get', (key, value) => {
      expect(i).to.equal(1); // the event is emitted after the return
      expect(key).to.equal('myKey');
      expect(value).to.equal('myValue');
      done();
    });

    appCache.create('myKey', 'myValue');
    expect(appCache.get('myKey')).to.equal('myValue');
    expect(i++).to.equal(0);
  });

  it('Emits get if the value is not in cache', done => {
    appCache.once('get', (key, value) => {
      expect(key).to.equal('notInCache');
      expect(value).to.be.undefined;
      done();
    });

    appCache.get('notInCache');
  });

});
