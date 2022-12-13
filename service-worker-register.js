const load = (uri) => {
  const tag = `<script type="module" src="${uri}" />`;
  document.body.insertAdjacentHTML('beforeend', tag);
};

const loadIndex = () => load('./src/index');

(async () => { 
  if (navigator.serviceWorker) {
    await navigator.serviceWorker.register('service-worker.js', { scope: './' });
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      console.log('RELOAD!');
      window.location.reload(); // https://stackoverflow.com/a/62596701
      // navigator.serviceWorker.addEventListener('controllerchange', loadIndex);
    } else {
      loadIndex();
    }
  }
})();
