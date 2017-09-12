//**************FRONTEND*********** */
console.log('frontend.js loaded');

let frontend;
let diskussing = new Diskussing();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.directive) {
            case "webextension-loaded":
                let popups = chrome.extension.getViews();
                frontend = popups[1];

                //Bouton de connexion
                frontend.$('.connectbutton').click(() => {
                    //Récupère les informations saisies
                    let socket = frontend.$('.connectserver').val();
                    let username = frontend.$('.connectname').val();

                    //Essaie de se connecter au serveur
                    if(diskussing.server.Connect(socket, username) == "success"){
                        //Affichage de l'interface principale
                        diskussing.SwitchLoginPage(frontend);
                    } /*else {
                        //Affichage du message d'erreur
                        diskussing.ShowErrorModal(frontend, "Unable to connect to server.");
                    } */
                });

                sendResponse({}); // sending back empty response to sender
            break;
        }
    }
);