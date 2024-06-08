type IFetch = typeof globalThis.fetch;
type IFetchParams = Parameters<IFetch>;

export type FetchInterceptorResponse = Response & { request?: Request };

export interface FetchInterceptor {
  request?: (...args: IFetchParams) => IFetchParams;
  requestError?: (error: Error) => Promise<never> | never;
  response?: (response: FetchInterceptorResponse) => FetchInterceptorResponse;
  responseError?: (error: Error) => Promise<never> | never;
}

let interceptors: FetchInterceptor[] = [];

function interceptor(fetch: IFetch, ...args: IFetchParams): Promise<Response> {
  const reversedInterceptors = interceptors.reverse();

  let requestPromise: Promise<IFetchParams> = Promise.resolve(args);

  // Register request interceptors
  reversedInterceptors.forEach(({ request, requestError }) => {
    if (request || requestError) {
      requestPromise = requestPromise.then(
        request ? (args) => request(...args) : undefined,
        requestError
      );
    }
  });

  // Register fetch call
  let responsePromise: Promise<FetchInterceptorResponse> = requestPromise.then(
    async (args) => {
      const request = new Request(...args);
      try {
        const response: FetchInterceptorResponse = await fetch(request);
        response.request = request;
        return response;
      } catch (error) {
        if (typeof error === 'object' && error !== null) {
          (error as Record<string, unknown>).request = request;
        }
        return await Promise.reject(error);
      }
    }
  );

  // Register response interceptors
  reversedInterceptors.forEach(({ response, responseError }) => {
    if (response || responseError) {
      responsePromise = responsePromise.then(response, responseError);
    }
  });

  return responsePromise;
}

export default function attach(env: typeof globalThis) {
  function wrapFetch(fetch: IFetch) {
    return function (...args: IFetchParams) {
      return interceptor(fetch, ...args);
    };
  }

  function register(interceptor: FetchInterceptor): () => void {
    interceptors.push(interceptor);
    return () => {
      const index = interceptors.indexOf(interceptor);
      if (index >= 0) {
        interceptors.splice(index, 1);
      }
    };
  }

  function clear() {
    interceptors = [];
  }

  const wrappedFetch = wrapFetch(env.fetch);
  Object.assign(wrappedFetch, { _register: register, _clear: clear });
  env.fetch = wrappedFetch;

  return { register, clear };
}
