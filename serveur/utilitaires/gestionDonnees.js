const fs = require('fs');

exports.sauvegarderDonnees = (fichier, donnees) => {
	const jsonData = fs.readFileSync(fichier, 'utf8');
	const tab = JSON.parse(jsonData);//convertir dans un tableau
	tab.push(donnees); //ajouter le nouveau dans le tableau
    fs.writeFileSync(fichier, JSON.stringify(tab)); 
}

exports.listeAbonnements = (fichier) => {
	const jsonData = fs.readFileSync(fichier, 'utf8');
    tab = JSON.parse(jsonData);//convertir dans un tableau
    return tab;
}
