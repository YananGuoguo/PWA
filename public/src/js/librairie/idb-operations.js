//Librairie pour les opérations sur la base de données idb (IndexedDB) dbfilms
//tester si le navigateur a indexedDB
// if (!window.indexedDB) {
//   console.log('Dans ce navigateur IndexedDB pas disponible');
// }

let dbPromise = idb.open('dbfilms', 1, (db) => {//dbfilms la base de données
  console.log("idb.open dbfilms", db)
    if (!db.objectStoreNames.contains('films')) {//films la «table»
      db.createObjectStore('films', {keyPath: 'id'});//clé de recherche
    }
  });

  function enregistrer(st, donnees) {
    console.log("进入enregistrer")
    return dbPromise
      .then((db) => {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.put(donnees);
        return tx.complete;
      });
  }

  function contenuStore(st) {
    console.log("进入contenuStore")
    return dbPromise
      .then((db) => {
        var tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.getAll();
      });
  }