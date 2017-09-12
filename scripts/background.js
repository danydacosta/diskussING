console.log('background.js loaded');

class Diskussing{
    constructor(){
        this.server = new Server();
    }

    ShowCreateChannelWindow(){
        $('.blur').toggleClass('displaynone');
        $('.modal').toggleClass('displaynone');
        $('.toggle').toggleClass('displaybehind');
    }

    ShowEditChannelWindow(title, description, keepChannel, owner){

    }

    CloseModal(){
        $('.blur').toggleClass('displaynone');
        $('.modal').toggleClass('displaynone');
        $('.toggle').toggleClass('displaybehind');
    }

    SwitchLoginPage(frontend){
        frontend.$('.main-container').toggleClass('displaynone');
        frontend.$('.connect-container').toggleClass('displaynone');
    }

    UpdateChannelSideBar(){

    }

    ShowChat(){

    }

    HideChat(){

    }
}

class Server{
    constructor(){
        this.connectedUser;
        this.channels = [];        
    }

    Connect(socket, name){

    }

    JoinChannel(channel){

    }

    SendMessage(channel, message){

    }

    LeaveChannel(channel){

    }

    CreateChannel(name, description, keepChannel){

    }

    EditChannel(channel, name, description, keepChannel, owner){

    }

    FetchNotices(){

    }

    FetchUsers(channel){

    }

    Disconnect(user){

    }

    Request(type, query, params = []){

    }
}

/**
 * Programme principal
 */
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
                    } else {
                        //Affichage du message d'erreur

                    } 
                });

                sendResponse({}); // sending back empty response to sender
            break;
        }
    }
);