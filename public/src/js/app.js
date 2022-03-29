import {PUBLIC_KEY} from '../constants/keys';
//Création de la bd et des différents stores. Si déjà fait il les ouvre simplement
//et donc accessibles au SW pour les oérations via le fichier idb-operations.js
//Même primcipe du côté de l'applications. Ne pas oubleir qu'ils fonctionnent dur 
//deux «threds» différents.

let infosBD={'bd':'bdfilms', 'stores':[{'st':'films','id':'id'},{'st':'sync-films','id':'id'}]};
var dbPromise=creerBD(infosBD);//on le fait dans apps.js pour rendre dbPromise dispobile aux
                              //opérations sur la BD. On aura un dbPromise disponible dans le «Main Thread»
                              //de l'application

//Pour affecter le event click sur l'élément au lieu de la faire dans la balise
//var buttonInstallAapp = document.querySelector('#install-app');
//buttonInstallAapp.addEventListener('click', montrerInstallBanner);

function montrerInstallBanner() {
    if (promptDiffere) {
        promptDiffere.prompt();
        promptDiffere.userChoice.then(function(choiceResult) {
        if (choiceResult.outcome === 'dismissed') {
          console.log('Installation cancellée');
        } else {
          console.log('Usager a installé notre application');
        }
      });
      promptDiffere = null;
    }
  }

$( document ).ready(function() {
    $( "#btAjouterFilm" ).click(function() {
      $( "#divAjouter" ).toggle( "slow");
    });
});

var formAjouter=document.querySelector('#formAjouter');
var titre=document.querySelector('#Titre');
var res=document.querySelector('#Realisateur');
var categ=document.querySelector('#Categorie');
var duree=document.querySelector('#Duree');

formAjouter.addEventListener('submit', (event) => {
  event.preventDefault();//pour éviter le submit par défaut qu'envoie tout de suite les données

  if (titre.value.trim() === '' || res.value.trim() === '') {//on ferait une vraie validation des données
    alert('Vérifiez vos données!');
    return;
  }
  else{
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then((sw) => {//instance du SW
          film = {//film à envoyer au serveur
            id:99, //dans notre store on a définit une clé
            Titre:titre.value,
            Realisateur:res.value,
            Categorie:categ.value,
            Duree:duree.value,
            CheminPochette:"src/images/pochettes/Doubtfire.jpg"
         };
          //enregistrer les infos du film dans notre BD bdfilms
          enregistrer('sync-films', film)
            .then(function() {
              return sw.sync.register('sync-nouveau-film');//tag de notre Sync Task enregistré dans le SW
            })
            .then(function() {
              document.querySelector('#msg').innerHTML="Enregistré dans le store sync-films";
              setInterval(() => { document.querySelector('#msg').innerHTML=""; }, 5000);
            })
            .catch(function(err) {
              console.log(err);
            });
        });
    } else {
      ajouterFilm();//définie dans films-service.js
    }
  }
})

function afficherDansListeFilms(unFilm){
  vueListeFilms = '<div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp">'+
'              <div class="mdl-card__media">'+
'                <img src="'+unFilm.CheminPochette+'" height:"120px">'+
'              </div>'+
'              <div class="mdl-card__title">'+
'                 <h4 class="mdl-card__title-text">'+unFilm.Titre+'</h4>'+
'              </div>'+
'              <div class="mdl-card__supporting-text">'+
'                <p class="mdl-typography--font-light mdl-typography--subhead"><strong>Titre : </strong>'+unFilm.Titre+'</p>'+
'                <p class="mdl-typography--font-light mdl-typography--subhead"><strong>Réalisateur : </strong>'+unFilm.Res+'</p>'+
'                <p class="mdl-typography--font-light mdl-typography--subhead"><strong>Catégorie : </strong>'+unFilm.Categ+'</p>'+
'                <p class="mdl-typography--font-light mdl-typography--subhead"><strong>Durée : </strong>'+unFilm.Duree+'</p>'+
'              </div>'+
'              <div class="mdl-card__actions">'+
'                 <a class="films-link mdl-button mdl-js-button mdl-typography--text-uppercase" href="">'+
'                   Savoir plus'+
'                   <i class="material-icons">chevron_right</i>'+
'                 </a>'+
'              </div>'+
'            </div>         ';
document.getElementById("listeFilms").innerHTML+=vueListeFilms;
}


//Gestion des permission
//Cas : demande de permission

var boutonsNotification = document.querySelectorAll('.permission-notification');

//CAS 1 : par le JS de l'application
// function demandePermission() {
//   Notification.requestPermission((resp) => {console.log(resp);
//     if (resp !== 'granted') {
//       console.log('Permission refusée!');
//     } else {
//       console.log("Permission acceptée");
//       new Notification('Vous avez la permission de notifications!');//peut avoir des options, voir doc
//     }
//   });
// }

//CAS 2 : par le SW 
function montrerNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: "Vous avez maintenant l'autorisation d'utiliser les Notifications Push!",
      icon: '/src/images/icons/icon-96x96.png',
      image: '/src/images/icons/notif.png',
      vibrate: [100, 50, 200],
      badge: '/src/images/icons/icon-96x96.png',
      tag: 'notification-confirmation',
      renotify: true,
      actions: [
        { action: 'accepter', title: 'Accepter', icon: '/src/images/icons/icon-96x96.png' },
        { action: 'annuler', title: 'Annuler', icon: '/src/images/icons/icon-96x96.png'}
      ]
    };

    navigator.serviceWorker.ready
      .then((sw) => {
        sw.showNotification('Merci de votre demande!', options);
      });
  }
}

function demandePermission() {
  Notification.requestPermission((resp) => {
    if (resp !== 'granted') {
      console.log('Permission refusée!');
    } else {
      console.log("Permission acceptée");
     configurePushSub();
    }
  });
}

if ('Notification' in window) {
  for(bt of boutonsNotification){
    bt.addEventListener('click', demandePermission);
    bt.style.display='block'
  }
}

//Notifications Push
function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  var swab;
  navigator.serviceWorker.ready
    .then((sw) => {
      swab = sw;//pouvoir l'utiliser globalement
      return sw.pushManager.getSubscription();
    })
    .then((abo) => {
      if (abo === null) {
        // Créer un nouveau abonnement
        var vapidPublicKey = PUBLIC_KEY;
        var newVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return swab.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: newVapidPublicKey
        });
      } else {
        console.log("Fini abonnement");
        // // on a déjà une inscription pour cette app et ce navigateur
        //    abo.unsubscribe().then(function(successful) {
        //    })
        // return;
      }
    })
    .then((nouveauAbonnement) => {
      return fetch('/push-abonnements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(nouveauAbonnement)
      })
    })
    .then(function(res) {
      if (res.ok) {
        montrerNotification();
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}
