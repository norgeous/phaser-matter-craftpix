importScripts(
  // 'https://unpkg.com/@babel/standalone@7.19.2/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.19.2/babel.min.js',
  './packageConfig.js',
);

const CACHE_NAME = `${globalThis.packageConfig.name}@${globalThis.packageConfig.version}`;
const isDev = location.hostname === 'localhost';

const getCache = () => caches.open(CACHE_NAME);

// delete all caches (except the one to keep)
const deleteCaches = async (keep) => {
  const keyList = await caches.keys();
  // console.log('found caches:', keyList);
  return Promise.all(keyList.reduce((acc, key) => {
    // console.log('found a cache:', key);
    if (!isDev && key === keep) return acc;
    return [
      ...acc,
      caches.delete(key),
    ];
  }, []));
};

const getUrl = request => {
  const scope = self.registration.scope.replace(location.origin, '');
  const url = new URL(request.url);
  url.isSelfHosted = url.host === location.host;
  url.isRoot = scope === url.pathname;
  url.ext = url.pathname.includes('.') ? url.pathname.split('.').pop() : undefined;

  // auto append .js to all local files which dont have an ext already (ignoring the index.html)
  if (url.isSelfHosted && !url.isRoot && !url.ext) {
    url.pathname = `${url.pathname}.js`;
    url.ext = 'js';
  }

  return url;
};

const getResponse = async url => {
  // if found in cache return cached response
  const cachedResponse = await caches.match(url);
  if (cachedResponse) {
    // console.info('✅ CACHE HIT  :', url.href);
    return cachedResponse;
  }

  // otherwise fetch it
  // console.info('❌ CACHE MISS :', url.href);
  const fetchedResponse = await fetch(url).catch(e => {
    console.error(url);
    console.error(e);
  });

  // add new fetches into the cache
  if (!isDev) {
    const cache = await getCache();
    cache.add(url);
  }

  return fetchedResponse;
};

const handleRequest = async request => {
  const url = getUrl(request);
  const response = await getResponse(url); // from cache or fetch

  // transpile self hosted js files using react preset
  if (response.status === 200 && url.isSelfHosted && url.ext === 'js') {
    const text = await response.text();
    const { code } = Babel.transform(text, { presets: ['react'] });
    return new Response(code, response);
  }

  // exit point for all other self hosted file types (such as svg, css, etc)
  return response;
};

const messageHandlers = {
  CLEAR_CACHES: () => {
    console.log('delete all caches');
    return deleteCaches();
  },
};

self.addEventListener('activate', event => event.waitUntil(clients.claim()));
self.addEventListener('activate', event => event.waitUntil(deleteCaches(CACHE_NAME)));
self.addEventListener('fetch', event => event.respondWith(handleRequest(event.request)));
self.addEventListener('message', event => messageHandlers[event.data?.type]?.());
