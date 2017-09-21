//**************FRONTEND*********** */
console.log('frontend.js loaded');

let frontend;

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
                    new Diskussing().server.Connect(socket, username);
                });

                //Fermeture des fenêtres modal
                frontend.$('.close').click(function() {
                    new Diskussing().CloseModal($(this).parent().prop('className'));
                });

                //Affichage de la sidebar
                frontend.$('.toggle').click(() => {                    
                    new Diskussing().SwitchSidebar();
                });
                
                //Clique sur salon (utilisation de delegate car les salons sont ajoutés dynamiquement)
                frontend.$('.sidebar').delegate('a', 'click', function() {
                    //Récupère le nom du salon
                    let channel = frontend.$(this).text();
                    new Diskussing().server.JoinChannel(channel, null);
                    console.log('Channel ' + channel + ' clicked!');
                });

                //Envoie un message
                frontend.$('.sendbutton').click(() => {
                    //Récupère le nom du salon et le message
                    let channel = frontend.$('.currentchannel').text().replace("-", " ");
                    let message = frontend.$('.messagetext').val();
                    //Envoie le message au serveur
                    new Diskussing().server.SendMessage(channel, message);
                    //Clear la textbox de saisie du message
                    frontend.$('.messagetext').val('');
                });

                //Affiche la modal de création de salon
                frontend.$('.addbutton').click(() => {
                    new Diskussing().ShowCreateChannelModal();                    
                });

                //Envoie du formulaire
                frontend.$('.modalsubmit').click(() => {
                    //Récupère les informations saisie
                    let title = frontend.$('.channeltitle').val();
                    let description = frontend.$('.channeldescription').val();
                    let channelKeep = frontend.$('.channelkeep').val();
                    //Crée le salon
                    new Diskussing().server.CreateChannel(title, description, channelKeep);
                });

                sendResponse({}); // sending back empty response to sender
            break;
        }
    }
);