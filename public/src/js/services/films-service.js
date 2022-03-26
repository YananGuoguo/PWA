async function getFilms(){
    //Fetch un fichier json
    console.log("getFilms::::")
    let url = 'http://localhost:8081/src/js/bdfilms.json';
    let reponse = await fetch(url);
    reponse = await reponse.json(); // lit reponse du body et retourne en format JSON
    console.log("getFilms::::reponse::", reponse)
    return reponse;
}