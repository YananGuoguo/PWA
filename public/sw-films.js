importScripts('/src/js/librairie/idb.js');
importScripts('/src/js/librairie/idb-operations.js');

const versionCache = '4';
const NOM_CACHE_STATIQUE = `cache-statique-${versionCache}`;
const NOM_CACHE_DYNAMIQUE = `cache-dynamique-${versionCache}`;

//Création de la bd et des différents stores. Si déjà fait il les ouvre simplement
//et donc accessibles au SW pour les oérations via le fichier idb-operations.js
//Même primcipe du côté de l'applications. Ne pas oubleir qu'ils fonctionnent dur 
//deux «threds» différents.

let infosBD={'bd':'bdfilms', 'stores':[{'st':'films','id':'id'},{'st':'sync-films','id':'id'}]};
var dbPromise=creerBD(infosBD);//on aura un dbPromise disponible dans le «Thread» du SW et ainsi les
                              //les opérations sur la BD seront disponibles.


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
  'src/js/sw-enregistrer.js',
  'src/js/bdfilms.js',
  'src/js/bdfilms.json',
  'src/js/jquery-3.5.1.min.js',

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
  let url = 'http://localhost:8081/src/js/bdfilms.json';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(fetch(event.request)
      .then((resp) => {
        var cloneResp = resp.clone();
        cloneResp.json()
          .then((donnees) => {
            for (var film of donnees) {
              enregistrer('films', film);//cet appel à besoin de dbPromise
            }
            return resp;
          })
          return resp;
      })
    )
  }
  else{ 
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
    }
});


self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-nouveau-film') {
    console.log('[Service Worker] sync nouveau film');
    event.waitUntil(
      contenuStore('sync-films')
        .then((listeFilms) =>  {
          for (var unFilm of listeFilms) {console.log("En SW");console.log(JSON.stringify(unFilm));
            fetch('/enregistrer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(unFilm)
            })
              .then((res) => {
                
                console.log("response 在sw-films.js中：：",res);
                //afficherDansListeFilms(leFilmEnregistre);
                if (res.ok) {
                  //supprimerElement('sync-films',unFilm.NumFilm);
                }
              })
              .catch((err) => {
                console.error('Erreur avec envoyer les données', err);
              });
          }

        })
    );
  }
});

//Pour les notifications
self.addEventListener('notificationclick', (event) => {
  var notification = event.notification;
  var action = event.action;

  console.log("notification:", notification);

  if (action === 'accepter') {
    console.log('Vous avez choisi accepter');
  } else if (action === 'infos'){
      event.waitUntil(
        clients.matchAll()
          .then((cls) => {
            var client = cls.find((c) => {
              return c.visibilityState === 'visible';
            });

            if (client !== undefined) {
              client.navigate(notification.data);
              client.focus();
            } else {
              client.openWindow(notification.data);
            }
            notification.close();
          })
      );
  }
  else {
    console.log(action);
  }
  notification.close();
});

//Push Notifications
self.addEventListener('push', (event) => {
  const obj = event.data.json();
  
  const options = {
    body: obj.content,
    data: obj.url,
    icon: '/src/images/icons/icon-96x96.png',
    badge: '/src/images/icons/icon-96x96.png',
    actions: [
            { action: 'infos', title: 'Infos', icon: '/src/images/icons/icon-96x96.png'}
          ]
  };
  event.waitUntil(self.registration.showNotification(obj.title, options));
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification fermée', event);
});
