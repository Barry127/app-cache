const { expect } = require('chai');
const appCache = require('./index');

describe('AppCache::getOptions', () => {

  const someOptions = {
    mutable: true,
    readOnly: true,
    validate: () => false
  };

  afterEach(() => {
    appCache.delete('myKey');
  });

  it('Returns the options', () => {
    appCache.create('myKey', 'myValue', someOptions);
    expect(appCache.getOptions('myKey')).to.eql(someOptions);
  });

  it('Returns null if the value is not in cache', () => {
    expect(appCache.getOptions('notInCache')).to.be.null;
  });

  it('Emits getOptions after getting the options', done => {
    let i = 0;

    appCache.once('getOptions', (key, options) => {
      expect(i).to.equal(1); // the event is emitted after the return
      expect(options.mutable).to.be.false;
      expect(options.readOnly).to.be.false;
      done();
    });

    appCache.create('myKey');
    expect(appCache.getOptions('myKey').validate).to.be.a('function');
    expect(i++).to.equal(0);
  });

  it('Emits getOptions if the value is not in cache', done => {
    appCache.once('getOptions', (key, options) => {
      expect(key).to.equal('notInCache');
      expect(options).to.be.null;
      done();
    });

    appCache.getOptions('notInCache');
  });

  it('Returns a clone of the options', () => {
    appCache.create('myKey', 'myValue', someOptions);
    expect(appCache.getOptions).to.not.eql(someOptions);

    appCache.create('someKey', 'someValue', {
      readOnly: true
    });

    const returnedOptions = appCache.getOptions('someKey');
    expect(returnedOptions.readOnly).to.be.true;
    returnedOptions.readOnly = false;
    expect(appCache.getOptions('someKey').readOnly).to.be.true;

    appCache.delete('someKey'); // clean up
  });

  it('The return value and emitted value are both different clones', done => {
    let returnedOptions;

    appCache.once('getOptions', (key, options) => {
      expect(key).to.equal('myKey');
      expect(options.readOnly).to.be.true;
      done();
    });

    appCache.create('myKey', 'myValue', true);
    returnedOptions = appCache.getOptions('myKey');
    expect(returnedOptions.readOnly).to.be.true;
    returnedOptions.readOnly = false;
  });
});
