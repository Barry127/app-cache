const { expect } = require('chai');
const appCache = require('./index');

describe('readOnly', () => {

  describe('create', () => {

    afterEach(() => {
      appCache.delete('myKey');
    });

    it('Is not readOnly by default', () => {
      appCache.create('myKey');
      expect(appCache.getOptions('myKey').readOnly).to.be.false;
    });

    it('Sets the readOnly setting', () => {
      appCache.create('myKey', null, { readOnly: true });
      expect(appCache.getOptions('myKey').readOnly).to.be.true;
    });

    it('Sets the value with readOnly', () => {
      appCache.create('myKey', 'myValue', { readOnly: true });
      expect(appCache.get('myKey')).to.equal('myValue');
    });

  });

  describe('set', () => {

    afterEach(() => {
      appCache.delete('myKey');
    });

    it('Sets the value if not readOnly', () => {
      appCache.create('myKey');
      appCache.set('myKey', 'myValue');
      expect(appCache.get('myKey')).to.equal('myValue');
    });

    it('Throws a TypeError if readOnly', () => {
      appCache.create('myKey', null, { readOnly: true });
      expect(appCache.set.bind(appCache, 'myKey', 'myValue')).to.throw(TypeError);
    });

  });

});
