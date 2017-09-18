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

                //Affichage de la sidebar
                frontend.$('.toggle').click(() => {                    
                    diskussing.SwitchSidebar();
                });
                
                //Clique sur salon (utilisation de delegate car les salons sont ajoutés dynamiquement)
                frontend.$('.sidebar').delegate('a', 'click', function() {
                    //Récupère le nom du salon
                    let channel = frontend.$(this).text();
                    diskussing.server.JoinChannel(channel);
                    console.log('Channel ' + channel + ' clicked!');
                });

                //Envoie un message
                frontend.$('.sendbutton').click(() => {
                    //Récupère le nom du salon et le message
                    let channel = frontend.$('.currentchannelname').val();
                    let message = frontend.$('.messagetext').val();

                    diskussing.server.SendMessage(channel, message);
                });

                sendResponse({}); // sending back empty response to sender
            break;
        }
    }
);