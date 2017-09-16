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
                    diskussing.server.Connect(socket, username);
                });

                //Fermeture des fenêtres modal
                frontend.$('.close').click(function() {
                    diskussing.CloseModal(frontend, $(this).parent().prop('className'));
                });

                sendResponse({}); // sending back empty response to sender
            break;
        }
    }
);