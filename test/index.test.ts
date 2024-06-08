/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import 'cross-fetch/polyfill';
import fetchInterceptor from '../src/browser';

describe('fetch-intercept', function () {
  // let fetchInterceptor: FetchInterceptorModule;
  beforeEach(() => {
    fetchInterceptor.clear();
  });

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

  it('should modify fetch calls', async () => {
    fetchInterceptor.register({
      request: (input, init) => [
        input || 'http://google.com',
        { ...init, mode: 'no-cors' },
      ],
    });
    expect(() => fetch('')).not.toThrow();
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
  });

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

  it('should support async interceptors', async () => {
    expect.assertions(2);
    const request = jest
      .fn()
      .mockImplementation(async (...args) => Promise.resolve(args));
    const response = jest
      .fn()
      .mockImplementation(async (x) => Promise.resolve(x));
    // @ts-ignore
    fetchInterceptor.register({ request, response });
    await fetch('https://google.com', { mode: 'no-cors' });
    expect(request).toHaveBeenCalledTimes(1);
    expect(response).toHaveBeenCalledTimes(1);
  });

  it('should intercept response errors', function (done) {
    let responseIntercepted = false;

    fetchInterceptor.register({
      responseError: function (error) {
        responseIntercepted = true;
        return Promise.reject(error);
      },
    });

    fetch('', {
      mode: 'no-cors',
    }).catch(function () {
      expect(responseIntercepted).toBe(true);
      done();
    });
  });

  it('should throw unintercepted request errors', async () => {
    expect.assertions(1);
    fetchInterceptor.register({
      request: () => {
        throw new Error('foo');
      },
      response: (x) => x,
      responseError(error) {
        throw error;
      },
    });
    fetchInterceptor.register({
      response: (x) => x,
      responseError(error) {
        return Promise.reject(error);
      },
    });
    try {
      await fetch('');
    } catch (e) {
      //@ts-ignore
      expect(e.message).toBe('foo');
    }
  });

  it('should intercept thrown request errors', async () => {
    expect.assertions(1);
    fetchInterceptor.register({
      requestError: (err) => {
        return Promise.reject(err.message + 'bar');
      },
    });
    fetchInterceptor.register({
      request: () => {
        throw new Error('foo');
      },
    });
    try {
      const result = await fetch('');
      console.log(result);
    } catch (e) {
      expect(e).toBe('foobar');
    }
  });

  it('should allow multiple response error handlers', async () => {
    fetchInterceptor.register({
      responseError: async (error) => {
        error.message += '1';
        throw error;
      },
    });
    fetchInterceptor.register({
      responseError: function (error) {
        error.message = '2';
        return Promise.reject(error);
      },
    });
    expect.assertions(1);
    try {
      await fetch('');
    } catch (e) {
      //@ts-ignore
      expect(e.message).toBe('21');
    }
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

  it('should unregister a registered interceptor', async function () {
    const request1 = jest.fn().mockImplementation((...x) => x);
    const request2 = jest.fn().mockImplementation((...x) => x);
    // @ts-ignore
    const unregister = fetchInterceptor.register({ request: request1 });
    // @ts-ignore
    fetchInterceptor.register({ request: request2 });

    unregister();

    await fetch('http://google.de', { mode: 'no-cors' });
    expect(request1).not.toHaveBeenCalled();
    expect(request2).toHaveBeenCalled();
  });

  it('should detach interceptor', async () => {
    expect.assertions(2);

    const request1 = jest.fn().mockImplementation((...x) => x);
    // @ts-ignore
    fetchInterceptor.register({ request: request1 });

    await fetch('http://google.de', { mode: 'no-cors' });
    expect(request1).toHaveBeenCalledTimes(1);

    const request2 = jest.fn().mockImplementation((...x) => x);
    fetchInterceptor.detach();
    // @ts-ignore
    fetchInterceptor.register({ request: request2 });
    await fetch('http://google.de', { mode: 'no-cors' });
    expect(request2).not.toHaveBeenCalled();
  });
});
