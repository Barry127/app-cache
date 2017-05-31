# AppCache

[![Known Vulnerabilities](https://snyk.io/test/github/barry127/app-cache/badge.svg)](https://snyk.io/test/github/barry127/app-cache)
[![Code Climate](https://codeclimate.com/github/Barry127/app-cache/badges/gpa.svg)](https://codeclimate.com/github/Barry127/app-cache)
[![Test Coverage](https://codeclimate.com/github/Barry127/app-cache/badges/coverage.svg)](https://codeclimate.com/github/Barry127/app-cache/coverage)

AppCache is a simple in memory key-value cache for global state in Node apps. AppCache takes away some of the pain of managing this data yourself by enforcing immutability on objects (AppCache clones object on get and set by default), read only setting and validators.

AppCache is no replacement for datastores like Redis or Memcached but can be used for things like:

 * Storing a password entered in stdin
 * Storing an average, total, min or max value of a database column for quick calculations on new inserts
 * Storing bits of data that where other parts of the app needs to be notified when it updates

## Installation

nstalling AppCache can be done using npm.

```bash
npm install --save app-cache
```

After installation AppCache can be included in your project. Since AppCache is a singleton it does not need to be instantiated using the new keyword.

```javascript
const appCache = require('app-cache');

appCache.create('myValue', 'fooBar', {
  readOnly: true
});

console.log(appCache.get('myValue')); // => fooBar

/* readOnly values cannot be set */
appCache.set('myValue', 'baz'); // => Throws a TypeError
```

## Testing

AppCache comes with a complete test suite. Just clone the repo from github the run all tests.

```bash
git clone https://github.com/Barry127/app-cache.git
cd app-cache
npm install
npm run test
```

## Docs

The complete docs can be found at https://barry127.github.io/app-cache
