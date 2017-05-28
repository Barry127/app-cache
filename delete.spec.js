const { expect } = require('chai');
const appCache = require('./index');

describe('AppCache::delete', () => {

  it('Deletes a value', () => {
    appCache.create('myKey', 'myValue');
    expect(appCache.get('myKey')).to.equal('myValue');
    appCache.delete('myKey');
    expect(appCache.get('myKey')).to.be.undefined;
  });

  it('Emits delete after deleting a value', done => {
    let i = 0;

    appCache.once('delete', key => {
      expect(i).to.equal(1); // the event is emitted after the return
      expect(key).to.equal('myKey');
      done();
    });

    appCache.create('myKey');
    appCache.delete('myKey');
    expect(i++).to.equal(0);
  });

  it('Does not emit delete if the value does not exist', done => {
    appCache.once('delete', key => {
      /* if noKey would emit key this listener would be called with noKey */
      expect(key).to.equal('myKey');
      done();
    });

    appCache.create('myKey');
    appCache.delete('noKey');
    appCache.delete('myKey');
  });

  it('Returns appCache', () => {
    appCache.create('myKey');

    expect(appCache.delete('noKey')).to.equal(appCache);
    expect(appCache.delete('myKey')).to.equal(appCache);
  });

});
