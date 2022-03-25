async function getFilms(){
    //Fetch un fichier json
    let url = 'http://localhost:8080/src/donnees/films.json';
    let reponse = await fetch(url);
    reponse = await reponse.json(); // lit reponse du body et retourne en format JSON
    return reponse;
}