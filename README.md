# fetch-intercept

[![CI](https://github.com/wilt00/fetch-intercept/actions/workflows/main.yml/badge.svg)](https://github.com/wilt00/fetch-intercept/actions/workflows/main.yml)

Interceptor library for the native fetch command inspired by [angular http interceptors](https://docs.angularjs.org/api/ng/service/$http), forked from [here](https://github.com/mlegenhausen/fetch-intercept)

`fetch-intercept` monkey patches the global `fetch` method and allows you the usage in Browser, Node and Webworker environments.

## Installation

```
npm install fetch-intercept --save
```

## Usage

_Note_: You need to require `fetch-intercept` before you use `fetch` the first time.

Make sure you have a `fetch` [compatible environment](http://caniuse.com/#search=fetch) or added a [appropriate polyfill](https://github.com/lquixada/cross-fetch).

```js
import fetchIntercept from 'fetch-intercept';

const unregister = fetchIntercept.register({
    request: function (url, config) {
        // Modify the url or config here
        return [url, config];
    },

    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
    },

    response: function (response) {
        // Modify the reponse object
        // Clone of original request is available as a property on the response param:
        console.log(response.request);
        return response;
    },

    // All interceptors can be asynchronous
    responseError: async function (error) {
        // Handle an fetch error
        throw error;
    }
});

// Interceptors are also available as properties on the global fetch object:
fetch._register({
    // Interceptors are applied in reverse order, so this will run before the one above
    request: (url, config) => [url, config]
})

// Call fetch to see your interceptors in action.
fetch('http://google.com');

// Unregister your interceptor
unregister();

// Detach interceptor completely; fetchIntercept will need to be reimported to enable interception after calling this
fetchIntercept.detach();
```

## React-Native Compatibility
Support react-native `0.17` or higher versions.

## License
MIT
