let montrerBandeAnnonce = (preview) => {
    if (preview !== 'undefined') {
        document.getElementById('idBA').src = preview;
    } else {
        document.getElementById('idBA').src = "https://www.youtube.com/embed/T7m4F5GlS5Q";
    }
    $('#modalBA').modal('show');
}

let enleverCard = (idCard) => {
    document.getElementById(idCard).style.display = 'none';
    document.getElementById(idCard).remove();
}

let creerCard = (unFilm) => {
    let uneCard = `
    <div class="col" id=${unFilm.id}>
        <div class="card  h-100 w-80" >
        <img src="${unFilm.posterUrl}" onerror="enleverCard(${unFilm.id});" 
        class="card-img-top asRatio" width=318 height=471>
        <div class="card-body">
            <h4 class="card-title">${unFilm.title}</h4>
            <h6>${unFilm.year}&nbsp;&nbsp;&nbsp;&nbsp;${unFilm.director}</h6>
            <p class="card-text">${(unFilm.plot).substring(0,60)}</p>
            
        </div>
        <a href="javascript:montrerBandeAnnonce('${unFilm.preview}');" class="btn btn-primary">Bande annonce</a>
        </div>
        
    </div>
  `;
    return uneCard;
}

let creerListe = (unCategory) =>{
    
    let uneLi = `
    <li>
        <a href="${unCategory}.html" class="dropdown-item" id="${unCategory}-films">${unCategory}</a>
    </li>
  `;
    return uneLi
}

let chargerCategories = () => {
    let listeCategory = `
    <a class="nav-link active dropdown-toggle" href="#"
                            data-bs-toggle="dropdown">Categories <span class="arrow_carrot-down"></span>
                            </a>
                            <ul class="dropdown-menu">`; 
  for (let i=0; i< tabCategories.length; i++){
       listeCategory += creerListe(tabCategories[i]);
  }
  listeCategory += `</ul>`;
  document.getElementById('category-ul').innerHTML = listeCategory;
}

let chargerFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        listeCards += creerCard(unFilm);
    }
    listeCards += `</div>`;
    document.getElementById('contenu').innerHTML = listeCards;
}

let chargerActionFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Action") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('action-movies').innerHTML = listeCards;
}

let chargerAdventureFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Adventure") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Adventure-movies').innerHTML = listeCards;
}

let chargerComedyFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Comedy") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('comedy-movies').innerHTML = listeCards;
}

let chargerFantasyFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Fantasy") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Fantasy-movies').innerHTML = listeCards;
}

let chargerCrimeFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Crime") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Crime-movies').innerHTML = listeCards;
}

let chargerDramaFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Drama") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Drama-movies').innerHTML = listeCards;
}

let chargerMusicFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Music") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Music-movies').innerHTML = listeCards;
}

let chargerHistoryFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("History") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('History-movies').innerHTML = listeCards;
}

let chargerThrillerFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Thriller") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Thriller-movies').innerHTML = listeCards;
}

let chargerAnimationFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Animation") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Animation-movies').innerHTML = listeCards;
}

let chargerFamilyFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Family") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Family-movies').innerHTML = listeCards;
}

let chargerMysteryFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Mystery") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Mystery-movies').innerHTML = listeCards;
}

let chargerBiographyFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Biography") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Biography-movies').innerHTML = listeCards;
}

let chargerFilmNoirFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Film-Noir") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Film-Noir-movies').innerHTML = listeCards;
}

let chargerRomanceFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Romance") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Romance-movies').innerHTML = listeCards;
}
let chargerSciFiFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Sci-Fi") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Sci-Fi-movies').innerHTML = listeCards;
}

let chargerWarFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("War") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('War-movies').innerHTML = listeCards;
}

let chargerWesternFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Western") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Western-movies').innerHTML = listeCards;
}

let chargerHorrorFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Horror") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Horror-movies').innerHTML = listeCards;
}

let chargerMusicalFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Musical") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Musical-movies').innerHTML = listeCards;
}

let chargerSportFilms = () => {
    let listeCards = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
    for (let unFilm of tabFilms) {
        if(unFilm.genres.indexOf("Sport") > -1){
            listeCards += creerCard(unFilm);
        }
    }
    listeCards += `</div>`;
    document.getElementById('Sport-movies').innerHTML = listeCards;
}



