import { PUBLIC_KEY, PRIVATE_KEY } from './public/src/constants/keys';

var util = require('./serveur/utilitaires/gestionDonnees');
const path = require('path');
const lodash = require('lodash');//certaines méthodes utilitaire comme isEmpty(obj)
const root_path=require('./serveur/utilitaires/root_path');
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const webpush = require('web-push');

const app = express();

app.use(express.static('public'));

var server = app.listen(8082, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Serveur démarré à http://%s:%s", host, port)
})
//Cet objet contiendra des paires clé-valeur, où la valeur peut être une chaîne ou un
//tableau (lorsque étendu est faux), ou n'importe quel type (lorsque étendu est vrai).
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());//parse seulement du json

app.get('/',(req, res) => {
	res.sendFile( __dirname + "/index.html" );//__dirname est le dossier actuel
});

app.post('/enregistrer',(req, res) => {
	//ou req.body au lieu de reponse
	film = {
		      Titre:req.body.Titre,
			  Realisateur:req.body.Realisateur,
			  Categorie:req.body.Categorie,
			  Duree:req.body.Duree,
			  CheminPochette:"src/images/pochettes/Doubtfire.jpg"
		   };
	
	let cheminFichierFilms=path.join(root_path,"/public/src/donnees/films.json");
	util.sauvegarderDonnees(cheminFichierFilms,film);//chemin et fichier et donnees
	let cheminFichierAbonnements=path.join(root_path,"/serveur/donnees/abonnements.json");
	var tabAbonnements = util.listeAbonnements(cheminFichierAbonnements);
	
	//Paramètres identifient du la compagnie (dans un vrai contexte fournir une vraie adresse), 
	//clé publique et clé privée
	/* 
		=======================================

		Public Key:
		BJ0RatSUAtU9UeqaMdhJFhTWr1F8rZ7_yRn-oLzp0dA7sE0DiAeEiiEe5-XQm77rdDr8oR2RmmHGvyeyVCqWL58

		Private Key:
		KxT2lT_CrRpxPl11-nE8BRVj9sghXJikDaOP2oAAPNY

		=======================================
	*/
	webpush.setVapidDetails('mailto:aaaa@gmail.com', PUBLIC_KEY, PRIVATE_KEY);
	tabAbonnements.forEach((abo) => {
		var pushConfig = {
		  endpoint: abo.endpoint,
		  keys: {
			auth: abo.keys.auth,
			p256dh: abo.keys.p256dh
		  }
		};
		webpush.sendNotification(pushConfig, JSON.stringify(
			{
				title: 'Nouveau film', 
				content: 'Un nouveau film vient d\'être ajouté.',
				url: 'http://collections.cinematheque.qc.ca/'
			}))
            .catch((err) => {
              console.log(err);
			})
		});//fin forEach
		//retour de la réponse à la demande pour enregistrer. Le code de statut HTTP 201 Created indique que la requête a 
		//réussi et qu'une ressource a été créée en conséquence.
		res.status(201).json({message: 'Film enregistré', id: req.body.Titre});
		//retour de la réponse au client. Une autre façon.
		//strReponse=JSON.stringify(film);
		// res.header('Content-type','application/json');
		// res.header('Charset','utf8');
		// res.send(strReponse);//on retourne le nouveau film pour l'afficher dans la page du client
});

app.post('/push-abonnements',(req, res) => {
	const unAbonnement=req.body;
	if(!lodash.isEmpty(unAbonnement)){
		let cheminFichierAbonnements=path.join(root_path,"/serveur/donnees/abonnements.json");
		util.sauvegarderDonnees(cheminFichierAbonnements,unAbonnement);//chemin et fichier et donnees
	}
	res.end();
});

