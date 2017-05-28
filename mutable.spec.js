const { expect } = require('chai');
const appCache = require('./index');

describe('mutable', () => {

  describe('create', () => {

    afterEach(() => {
      appCache.delete('myKey');
    });

    it('Is not mutable by default', () => {
      appCache.create('myKey');
      expect(appCache.getOptions('myKey').mutable).to.be.false;
    });

    it('Sets the mutable setting', () => {
      appCache.create('myKey', {}, { mutable: true });
      expect(appCache.getOptions('myKey').mutable).to.be.true;
    });

    it('Sets a new object if not mutable', () => {
      const myObj = {
        foo: 'bar'
      };

      appCache.create('myKey', myObj);
      myObj.bar = 'baz';

      expect(appCache.get('myKey')).to.not.eql(myObj);
      expect(appCache.get('myKey')).to.eql({ foo: 'bar' });
    });

    it('Emits a new object if not mutable', done => {
      const myObj = {
        foo: 'bar'
      };

      appCache.once('create', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.not.eql(myObj);
        expect(value).to.eql({ foo: 'bar' });
        done();
      });

      appCache.create('myKey', myObj);
      myObj.bar = 'baz';
    });

    it('Sets no new object if mutable', () => {
      const myObj = {
        foo: 'bar'
      };

      appCache.create('myKey', myObj, { mutable: true });
      myObj.bar = 'baz';

      expect(appCache.get('myKey')).to.eql(myObj);
    });

    it('Emits no new object if mutable', done => {
      const myObj = {
        foo: 'bar'
      };

      appCache.once('create', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.eql(myObj);
        done();
      });

      appCache.create('myKey', myObj, { mutable: true });
      myObj.bar = 'baz';
    });

  });

  describe('get', () => {

    afterEach(() => {
      appCache.delete('myKey');
    });

    it('Returns a clone of the value if not mutable', () => {
      const myObj = {
        foo: 'bar'
      };

      appCache.create('myKey', myObj);

      const get = appCache.get('myKey');
      get.bar = 'baz';

      expect(appCache.get('myKey')).to.not.eql(get);
      expect(appCache.get('myKey')).to.eql({ foo: 'bar' });
    });

    it('Emits a clone of the value if not mutable', done => {
      const myObj = {
        foo: 'bar'
      };

      appCache.create('myKey', myObj);
      const get = appCache.get('myKey');
      get.bar = 'baz';

      appCache.once('get', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.not.eql(get);
        expect(value).to.eql({ foo: 'bar' });
        done();
      });

      appCache.get('myKey');
    });

    it('The return value and emitted value are both different clones', done => {
      const myObj = {
        foo: 'bar'
      };

      let get;

      appCache.once('get', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.not.equal(myObj);
        expect(value).to.not.equal(get);
        expect(value).to.eql(myObj);
        expect(value).to.eql(get);
        done();
      });

      appCache.create('myKey', myObj);

      get = appCache.get('myKey');

      expect(get).to.not.equal(myObj);
      expect(get).to.eql(myObj);
    });

    it('Returns the actual object if mutable', () => {
      const myObj = {
        foo: 'bar'
      };

      appCache.create('myKey', myObj, { mutable: true });

      const get = appCache.get('myKey');

      expect(get).to.equal(myObj);
      get.bar = 'baz';

      expect(appCache.get('myKey')).to.eql({ foo: 'bar', bar: 'baz' });
    });

    it('Emits the actual object if mutable', done => {
      const myObj = {
        foo: 'bar'
      };
      let get;

      appCache.create('myKey', myObj, { mutable: true });

      appCache.once('get', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.equal(get);
        expect(value).to.equal(myObj);
        done();
      });

      get = appCache.get('myKey');
    });

  });

  describe('set', () => {

    afterEach(() => {
      appCache.delete('myKey');
    });

    it('Sets a new object if not mutable', () => {
      const myObj = {
        foo: 'bar'
      };

      appCache.create('myKey');
      appCache.set('myKey', myObj);

      const get = appCache.get('myKey');
      expect(get).to.eql(myObj);
      expect(get).to.not.equal(myObj);
    });

    it('Emits a new object if not mutable', done => {
      const myObj = {
        foo: 'bar'
      };

      appCache.once('set', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.eql(myObj);
        expect(value).to.not.equal(myObj);
        done();
      });

      appCache.create('myKey');
      appCache.set('myKey', myObj);
    });

    it('Sets no new object if mutable', () => {
      const myObj = {
        foo: 'bar'
      };

      appCache.create('myKey', null, { mutable: true });
      appCache.set('myKey', myObj);

      const get = appCache.get('myKey');
      expect(get).to.eql(myObj);
      expect(get).to.equal(myObj);
    });

    it('Emits no new object if mutable', done => {
      const myObj = {
        foo: 'bar'
      };

      appCache.once('set', (key, value) => {
        expect(key).to.equal('myKey');
        expect(value).to.eql(myObj);
        expect(value).to.equal(myObj);
        done();
      });

      appCache.create('myKey', null, { mutable: true });
      appCache.set('myKey', myObj);
    });

  });

});
