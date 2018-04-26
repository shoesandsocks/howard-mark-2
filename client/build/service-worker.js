/* eslint-disable no-console, no-sequences, no-undef, no-restricted-globals, no-return-assign, no-shadow, prefer-const, max-len, consistent-return, no-unused-expressions, array-callback-return, func-names */
const precacheConfig = [
  ['/index.html', '5e7c3fc7bb984593b1b1e731b4b2d410'],
  ['/static/css/main.7da4ee0f.css', '39f5dfe361f019153dcf72e676cb0091'],
  ['/static/js/main.dba07f65.js', '72cb31a8d7a93981846e36ed60715284'],
  ['/static/media/inconsolata-v16-latin-regular.4113edbe.svg', '4113edbe480fdeb4a887bd2638820e31'],
  ['/static/media/inconsolata-v16-latin-regular.5727034e.ttf', '5727034e2dbbd987999a352095b5f877'],
  ['/static/media/inconsolata-v16-latin-regular.626c21a5.woff', '626c21a55285b4a642ccacd0c6e05a6d'],
  ['/static/media/inconsolata-v16-latin-regular.a1b73ae2.eot', 'a1b73ae26612b7e8f0beeafd1e24a320'],
  [
    '/static/media/inconsolata-v16-latin-regular.e41ccb14.woff2',
    'e41ccb14c58f5986b994131632b843c7',
  ],
  ['/static/media/roboto-v18-latin-300.548ebe05.eot', '548ebe05978f34db74a97d9e9c0bbf3a'],
  ['/static/media/roboto-v18-latin-300.55536c8e.woff2', '55536c8e9e9a532651e3cf374f290ea3'],
  ['/static/media/roboto-v18-latin-300.a1471d1d.woff', 'a1471d1d6431c893582a5f6a250db3f9'],
  ['/static/media/roboto-v18-latin-300.ab2789c4.ttf', 'ab2789c48bf32d301cc7bb16677fb703'],
  ['/static/media/roboto-v18-latin-300.dd0bea1f.svg', 'dd0bea1f9a808d633492fa573039ca1d'],
];

const cacheName = `sw-precache-v3-sw-precache-webpack-plugin-${
  self.registration ? self.registration.scope : ''
}`;

/* ignoreUrlParametersMatching [Array⟨Regex⟩]
sw-precache finds matching cache entries by doing a comparison with the full request URL.
It's common for sites to support URL query parameters that don't affect the site's content
and should be effectively ignored for the purposes of cache matching.
One example is the utm_-prefixed parameters used for tracking campaign performance.
By default, sw-precache will ignore key=value when key matches any of the regular expressions
provided in this option. To ignore all parameters, use [/./]. To take all
parameters into account when matching, use [].

Default: [/^utm_/]
*/
const ignoreUrlParametersMatching = [/./];
// const ignoreUrlParametersMatching = [/^utm_/];

const addDirectoryIndex = function (e, t) {
  const a = new URL(e);
  return a.pathname.slice(-1) === '/' && (a.pathname += t), a.toString();
};
const cleanResponse = function (t) {
  return t.redirected
    ? ('body' in t ? Promise.resolve(t.body) : t.blob()).then(e => new Response(e, { headers: t.headers, status: t.status, statusText: t.statusText }))
    : Promise.resolve(t);
};
const createCacheKey = function (e, t, a, n) {
  const r = new URL(e);
  return (
    (n && r.pathname.match(n)) ||
      (r.search += `${(r.search ? '&' : '') + encodeURIComponent(t)}=${encodeURIComponent(a)}`),
    r.toString()
  );
};
const isPathWhitelisted = function (e, t) {
  if (e.length === 0) return !0;
  const a = new URL(t).pathname;
  return e.some(e => a.match(e));
};
const stripIgnoredUrlParameters = function (e, a) {
  const t = new URL(e);
  return (
    (t.hash = ''),
    (t.search = t.search
      .slice(1)
      .split('&')
      .map(e => e.split('='))
      .filter(t => a.every(e => !e.test(t[0])))
      .map(e => e.join('='))
      .join('&')),
    t.toString()
  );
};

const hashParamName = '_sw-precache';

const urlsToCacheKeys = new Map(precacheConfig.map((e) => {
  let t = e[0];
  let a = e[1];
  let n = new URL(t, self.location);
  let r = createCacheKey(n, hashParamName, a, /\.\w{8}\./);
  return [n.toString(), r];
}));

function setOfCachedUrls(e) {
  return e
    .keys()
    .then(e => e.map(e => e.url))
    .then(e => new Set(e));
}
self.addEventListener('install', (e) => {
  e.waitUntil(caches
    .open(cacheName)
    .then(n =>
      setOfCachedUrls(n).then(a =>
        Promise.all(Array.from(urlsToCacheKeys.values()).map((t) => {
          if (!a.has(t)) {
            const e = new Request(t, { credentials: 'same-origin' });
            return fetch(e).then((e) => {
              if (!e.ok) {
                throw new Error(`Request for ${t} returned a response with status ${e.status}`);
              }
              return cleanResponse(e).then(e => n.put(t, e));
            });
          }
        }))))
    .then(() => self.skipWaiting()));
}),
self.addEventListener('activate', (e) => {
  const a = new Set(urlsToCacheKeys.values());
  e.waitUntil(caches
    .open(cacheName)
    .then(t =>
      t.keys().then(e =>
        Promise.all(e.map((e) => {
          if (!a.has(e.url)) return t.delete(e);
        }))))
    .then(() => self.clients.claim()));
}),
self.addEventListener('fetch', (t) => {
  if (t.request.method === 'GET') {
    let e;
    let a = stripIgnoredUrlParameters(t.request.url, ignoreUrlParametersMatching);
    let n = 'index.html';
    (e = urlsToCacheKeys.has(a)) || ((a = addDirectoryIndex(a, n)), (e = urlsToCacheKeys.has(a)));
    const r = '/index.html';
    !e &&
        t.request.mode === 'navigate' &&
        isPathWhitelisted(['^(?!\\/__).*'], t.request.url) && // but is this involved too??
        ((a = new URL(r, self.location).toString()), (e = urlsToCacheKeys.has(a))),
    e &&
          t.respondWith(caches
            .open(cacheName)
            .then(e =>
              e.match(urlsToCacheKeys.get(a)).then((e) => {
                if (e) return e;
                throw Error('The cached response that was expected is missing.');
              }))
            .catch(
              e =>
                console.warn(
                  'Couldn\'t serve response for "%s" from cache: %O',
                  t.request.url,
                  e,
                ),
              fetch(t.request),
            ));
  }
});
