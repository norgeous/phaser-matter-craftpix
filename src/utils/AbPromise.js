export class AbPromise extends Promise {
  constructor(executor) {
    const controller = new window.AbortController();
    super((resolve, reject) => {
      controller.signal.addEventListener('abort', event => resolve(event.target.reason));
      executor(resolve, reject);
    });
    this.controller = controller;
  }

  // https://stackoverflow.com/questions/64155684/subclassing-the-promise-built-in-using-extends
  then(onFulfilled, onRejected) {
    const p = super.then(onFulfilled, onRejected);
    p.controller = this.controller;
    return p;
  }
}

// const p = new AbPromise((resolve, reject) => {
//   resolve('detest');
// })
//   .then(data => console.log('resolved with', data))
//   .finally(data => console.log('resolved, rejected or aborted with', data));


// p.controller.abort('test');
