const { expect } = require('chai');
const { AppCacheKeyError } = require('./errors');

describe('errors', () => {
  it('AppCacheKeyError extends Error', () => {
    expect(new AppCacheKeyError()).to.be.an.instanceof(Error);
  });

  it('AppCacheKeyError sets name and message', () => {
    const myError = new AppCacheKeyError('message');
    expect(myError.name).to.equal('AppCacheKeyError');
    expect(myError.message).to.equal('message');
  });
});
