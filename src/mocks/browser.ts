// import { setupWorker } from 'msw/browser';
// import { handlers } from './handlers';

// // This configures a Service Worker with the given request handlers.
// const worker = setupWorker(...handlers);

// export default worker;
let worker;

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서만 MSW를 설정합니다.
  const { setupWorker } = require('msw/browser');
  const { handlers } = require('./handlers');

  worker = setupWorker(...handlers);
}

export default worker;
