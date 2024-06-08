/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it } from '@jest/globals';

import 'cross-fetch/polyfill';
import fetchInterceptor from '../src/browser';

describe('fetch-intercept', function () {
  beforeEach(() => fetchInterceptor.clear());

  it('should intercept fetch calls', function (done) {
    let requestIntercepted = false;
    let responseIntercepted = false;

    fetchInterceptor.register({
      request: function (...args) {
        requestIntercepted = true;
        return args;
      },
      response: function (response) {
        responseIntercepted = true;
        return response;
      },
    });

    fetch('http://google.de', {
      mode: 'no-cors',
    }).then(function () {
      expect(requestIntercepted).toBe(true);
      expect(responseIntercepted).toBe(true);
      done();
    });
  });

  it('should support multiple request interceptors', (done) => {
    let interceptions: number[] = [];
    fetchInterceptor.register({
      request: (...args) => {
        interceptions.push(1);
        return args;
      },
    });
    fetchInterceptor.register({
      request: (...args) => {
        interceptions.push(2);
        return args;
      },
    });
    fetch('http://google.de', {
      mode: 'no-cors',
    }).then(function () {
      expect(interceptions).toStrictEqual([2, 1]);
      done();
    });
  });

  it('should support multiple response interceptors', (done) => {
    let interceptions: number[] = [];
    fetchInterceptor.register({
      response: (arg) => {
        interceptions.push(1);
        return arg;
      },
    });
    fetchInterceptor.register({
      response: (arg) => {
        interceptions.push(2);
        return arg;
      },
    });
    fetch('http://google.de', {
      mode: 'no-cors',
    }).then(function () {
      expect(interceptions).toStrictEqual([2, 1]);
      done();
    });
  })

  it('should support mixed interceptors', (done) => {
    let interceptions: number[] = [];
    fetchInterceptor.register({
      request: (...args) => {
        interceptions.push(1);
        return args;
      },
    });
    fetchInterceptor.register({
      response: (arg) => {
        interceptions.push(2);
        return arg;
      },
    });
    fetch('http://google.de', {
      mode: 'no-cors',
    }).then(function () {
      expect(interceptions).toStrictEqual([1, 2]);
      done();
    });
  });

  it('should intercept response errors', function (done) {
    let responseIntercepted = false;

    fetchInterceptor.register({
      responseError: function (error) {
        responseIntercepted = true;
        return Promise.reject(error);
      },
    });

    fetch('http://404', {
      mode: 'no-cors',
    }).catch(function () {
      expect(responseIntercepted).toBe(true);
      done();
    });
  });

  it('should intercept request interception errors', function (done) {
    let requestIntercepted = false;

    fetchInterceptor.register({
      requestError: function (error) {
        requestIntercepted = true;
        return Promise.reject(error);
      },
    });

    fetchInterceptor.register({
      request: function () {
        throw new Error('Error');
      },
    });

    fetch('http://google.com', {
      mode: 'no-cors',
    }).catch(function () {
      expect(requestIntercepted).toBe(true);
      done();
    });
  });

  it('should unregister a registered interceptor', function (done) {
    let requestIntercepted = false;

    const unregister = fetchInterceptor.register({
      request: function (...args) {
        requestIntercepted = true;
        return args;
      },
    });

    unregister();

    fetch('http://google.de', {
      mode: 'no-cors',
    }).then(function () {
      expect(requestIntercepted).toBe(false);
      done();
    });
  });
});
