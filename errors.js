class AppCacheKeyError extends Error {

  constructor (message) {
    super(message);
    this.name = 'AppCacheKeyError';
  }

}

module.exports = {
  AppCacheKeyError
};
