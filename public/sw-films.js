const versionCache = '2';
const NOM_CACHE_STATIQUE = `cache-statique-${versionCache}`;
const NOM_CACHE_DYNAMIQUE = `cache-dynamique-${versionCache}`;

//Ressources statiques pour mettre en cache
const ressources = [
  '/',
  '/index.html',
  '/favicon.ico',
  
  'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.getmdl.io/1.3.0/material.min.css', 

  'src/manifest.webmanifest',
  'src/css/style.css', 

  'src/js/vueFilms.js',
  'src/js/sw-enregistrer.js'

];

self.addEventListener('install', function(event) {
    console.log("[Service Worker] En cours d'installation du SW ...", event);
    event.waitUntil(
        caches.open(NOM_CACHE_STATIQUE).then(cache => {
          cache.addAll(ressources);
        })
      );
});

// self.addEventListener('activate', function(event) {
//     console.log("[Service Worker] En cours d'activation du SW ...", event);
//     return self.clients.claim();
// });

// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys().then(keys =>
//       Promise.all(
//         keys
//           .filter(key => key !== NOM_CACHE_STATIQUE && key !== NOM_CACHE_DYNAMIQUE )
//           .map(key => caches.delete(key)))
//     )
//   )
// });

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== NOM_CACHE_STATIQUE && key !== NOM_CACHE_DYNAMIQUE) {
            return caches.delete(key);
          }
        }));
      })
  );
});

//Cache statique et dynamique
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(resp) {
//               return caches.open(NOM_CACHE_DYNAMIQUE)
//                 .then(function(cache) {
//                   cache.put(event.request.url, resp.clone());
//                   return resp;
//                 })
//             });
//         }
//       })
//   );
// });

//Plus court
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        // Si dans le cache statique alors le retourner  
        response ||
        // sinon, prenez la réponse de la demande, ouvrez le cache dynamique 
        //et stockez-y la réponse
        // on utilise resp puisque response est déjà utilisé
        fetch(event.request).then(resp => { 
          return caches.open(NOM_CACHE_DYNAMIQUE).then(cache => {
            // vous devez stoker absolument un clone de la réponse soit resp
            cache.put(event.request.url, resp.clone());
            // puis renvoyez la demande d'origine au navigateur
            return resp;
          });
        })
      );
    }).catch(err => {})
  );
});
  