//**************BACKEND*********** */
console.log('backend.js loaded');

class Diskussing{
    constructor(){
        this.server = new Server();
    }

    ShowCreateChannelModal(frontend){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.modal').toggleClass('displaynone');
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    ShowEditChannelModal(frontend, title, description, keepChannel, owner){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.modal').toggleClass('displaynone');
        frontend.$('.channelownerlabel').toggleClass('displaynone');
        frontend.$('.channelowner').toggleClass('displaynone');
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    ShowErrorModal(frontend, exception){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.errormodal').toggleClass('displaynone');
        frontend.$('.errormodalcontent').html(exception);
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    CloseModal(frontend, modal){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$(`.${modal}`).toggleClass('displaynone');
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    SwitchLoginPage(frontend){
        frontend.$('.main-container').toggleClass('displaynone');
        frontend.$('.connect-container').toggleClass('displaynone');
    }

    UpdateChannelSideBar(frontend){
        //Cherche les salons existants
        this.server.FetchChannels();
        //Rafraichit la liste avec les salons existants sur le serveur
        this.server.channels.forEach(function(element) {
            frontend.$('.sidebar ul').append('<li><a href="#">' + element.name + '</a></li>');
        }, this);        
    }

    ShowChat(){

    }

    HideChat(){

    }
}

class Server{
    constructor(){
        this.connectedUser;
        this.address;
        this.channels = [];        
    }

    Connect(socket, name){
        //Set l'adresse du serveur qui sera utilisée pour les prochaines requêtes
        this.address = socket;

        //Requête au serveur
        this.Request(`users/register/${name}/`, data => {
            //Enregistrement de l'utilisateur
            this.connectedUser = new User(data.id, data.nick);                  
            console.log(this.connectedUser);
            //Affichage de l'interface principale
            diskussing.SwitchLoginPage(frontend);
            //Rafraichissement des notices
            setInterval(this.FetchNotices, 2000);
        }, 'POST');
    }
    
    FetchNotices(){ //Utilisation de chemin absolu de classe car la méthode est appelée depuis le callback de request
        //Requête au serveur
        diskussing.server.Request(`user/${diskussing.server.connectedUser.id}/notices`, data => {
            data.forEach(function(element) {
                console.log(element);
                switch(element.type){
                    case 'channelCreate':
                        console.log(element.channel.name + ' has been created!');
                        //Met à jour la barre latérale
                        diskussing.UpdateChannelSideBar(frontend);
                    break;

                    case 'channelJoin':
                        console.log(element.nick + ' has been join the channel ' + element.channel.name);
                    break;

                    case 'channelMessage':
                        console.log(element.nick + ' has sent the message ' + element.message + ' in the channel ' + element.channel.name);
                    break;

                    case 'channelLeave':
                        console.log(element.nick + ' has leaved the channel ' + element.channel.name);
                    break;

                    case 'channelOwner':
                        console.log('Owner of the channel ' + element.channel.name + ' is now ' + element.channel.owner + ' (previously ' + element.nick + ')');
                    break;
                }
            }, this);
        });
    }

    FetchChannels(){
        //Requête au serveur
        this.Request(`channels/`, data => {
            console.log(data);
            this.channels = data;
        });
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

    FetchUsers(channel){

    }

    Disconnect(user){

    }

    Request(url, callback, type = 'GET', baseUrl = `http://${this.address}/`){
        $.ajax({
            url: baseUrl + url.split('?')[0],
            type: type,
            data: url.split('?')[1],

            success: data => {
                callback(data);
            },
            error: function(xhr, status, error) {
                //Affichage du message d'erreur
                diskussing.ShowErrorModal(frontend, JSON.parse(xhr.responseText).error);
            }
        });
    }
}