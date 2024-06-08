import attach from './attach';
const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

const fetchInterceptor = attach(ENVIRONMENT_IS_WORKER ? self : window);
export default fetchInterceptor;
