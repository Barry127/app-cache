const { expect } = require('chai');
const appCache = require('./index');

describe('validate', () => {

  describe('create', () => {

    afterEach(() => {
      appCache.delete('myKey');
    });

    it('The default validate function returns true', () => {
      appCache.create('myKey');
      expect(appCache.getOptions('myKey').validate()).to.be.true;
    });

    it('Sets the validate function', () => {
      const myValidate = () => 'valid';

      appCache.create('myKey', null, { validate: myValidate });
      expect(appCache.getOptions('myKey').validate).to.equal(myValidate);
      expect(appCache.getOptions('myKey').validate()).to.equal('valid');
    });

    it('Does not validate when creating', () => {
      const myValidate = (value) => value === 'a';

      appCache.create('myKey', 'b', { validate: myValidate });
      expect(appCache.get('myKey')).to.equal('b');
    });

  });

  describe('set', () => {

    afterEach(() => {
      appCache.delete('myKey');
    });

    it('Sets the value if the validate function returns true', () => {
      const myValidate = () => true;

      appCache.create('myKey', null, { validate: myValidate });
      appCache.set('myKey', 'myValue');

      expect(appCache.get('myKey')).to.equal('myValue');
    });

    it('Does not set the value if the validate function returns false', () => {
      const myValidate = () => false;

      appCache.create('myKey', null, { validate: myValidate });
      appCache.set('myKey', 'myValue');

      expect(appCache.get('myKey')).to.not.equal('myValue');
      expect(appCache.get('myKey')).to.be.null;
    });

    it('Does not emit the value if the validate function returns false', done => {
      const myValidate = (value) => value === 'a';

      appCache.once('set', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.equal('a'); // not called when value was b
        done();
      })

      appCache.create('myKey', null, { validate: myValidate });
      appCache.set('myKey', 'b');
      appCache.set('myKey', 'a');
    });

    it('Sets the value if validate is not a function', () => {
      const myValidate = 'a string';

      appCache.create('myKey', null, { validate: myValidate });
      appCache.set('myKey', 'myValue');
      expect(appCache.get('myKey')).to.equal('myValue');
    });

  });

});
