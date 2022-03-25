//Pour affecter le evnt click sur l'élément au lieu de la faire dans la balise
//var buttonInstallAapp = document.querySelector('#install-app');
//buttonInstallAapp.addEventListener('click', montrerInstallBanner);

function montrerInstallBanner() {
    if (promptDiffere) {
        promptDiffere.prompt();
        promptDiffere.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome === 'dismissed') {
          console.log('Installation cancellée');
        } else {
          console.log('Usager a installé notre application');
        }
      });
      promptDiffere = null;
    }
  }