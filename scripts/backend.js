//**************BACKEND*********** */
console.log('backend.js loaded');

class Diskussing{
    constructor(){
        this.server = new Server();
    }

    ShowCreateChannelModal(){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.modal').toggleClass('displaynone');
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    ShowEditChannelModal(title, description, keepChannel, owner){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.modal').toggleClass('displaynone');
        frontend.$('.channelownerlabel').toggleClass('displaynone');
        frontend.$('.channelowner').toggleClass('displaynone');
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    ShowErrorModal(exception){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.errormodal').toggleClass('displaynone');
        frontend.$('.errormodalcontent').html(exception);
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    CloseModal(modal){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$(`.${modal}`).toggleClass('displaynone');
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    SwitchLoginPage(){
        frontend.$('.main-container').toggleClass('displaynone');
        frontend.$('.connect-container').toggleClass('displaynone');
    }

    SwitchSidebar(){
        frontend.$('.blur').toggleClass('displaynone');
        //Mise à jour des éléments dans la sidebar
        this.server.FetchChannels();
    }

    HideSidebar(){
        //Ferme la sidebar
        frontend.$('#slide').prop('checked', false);
        this.SwitchSidebar();
    }

    UpdateChannelSideBar(){
        //Vide l'ancienne liste de la sidebar
        frontend.$('.sidebar ul li:not(:first)').empty();
        //Rafraichit la liste avec les salons existants sur le serveur
        this.server.channels.forEach(function(element) {
            frontend.$('.sidebar ul').append('<li><a href="#">' + element.name + '</a></li>');
        }, this);
    }

    ShowChat(channel){
        frontend.$('.chat').toggleClass('displaynone');
        //Ajout d'un champ permettant l'identification du salon pour ledit chat
        frontend.$('.chat').append(`<input class="currentchannelname" value="${channel}" />`);
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
                        console.log('[NOTICE] ' + element.channel.name + ' has been created!');
                        //Mise à jour des éléments dans la sidebar
                        diskussing.server.FetchChannels();
                    break;

                    case 'channelJoin':
                        console.log('[NOTICE] ' + element.nick + ' has been join the channel ' + element.channel.name);
                    break;

                    case 'channelMessage':
                        console.log('[NOTICE] ' + element.nick + ' has sent the message ' + element.message + ' in the channel ' + element.channel.name);
                        //Formate la date
                        let date = new Date(element.time);
                        let formatedDate = date.getHours() + ':' + date.getMinutes();
                        //Ajoute le message dans le chat
                        frontend.$('.chat ul').append(`<li class="message">
                                                            <hr class="messagesperarator">
                                                            <div class="messagetextcontent">
                                                            <label class="messagefrom">${element.nick} : </label>
                                                            <label class="messagecontent">${element.message}</label>
                                                            <label class="messagedate">${formatedDate}</label>
                                                            </div>
                                                        </li>`);

                    break;

                    case 'channelLeave':
                        console.log('[NOTICE] ' + element.nick + ' has leaved the channel ' + element.channel.name);
                    break;

                    case 'channelOwner':
                        console.log('[NOTICE] Owner of the channel ' + element.channel.name + ' is now ' + element.channel.owner + ' (previously ' + element.nick + ')');
                    break;
                }
            }, this);
        });
    }

    FetchChannels(){
        //Requête au serveur
        this.Request(`channels/`, data => {
            console.log('The channel fetch has discoverd ' + data);
            this.channels = data;
            //Met à jour la barre latérale
            diskussing.UpdateChannelSideBar();
        });
    }

    JoinChannel(channel){
        //Requête au serveur
        this.Request(`user/${this.connectedUser.id}/channels/${channel}/join/`, data => {
            console.log(this.connectedUser.nick + ' has join the channel ' + data.channel.name);
            //Affichage du chat
            diskussing.ShowChat(channel);
            //Ferme la sidebar
            diskussing.HideSidebar();
        }, 'PUT');
    }

    SendMessage(channel, message){
        //Requête au serveur
        this.Request(`user/${this.connectedUser.id}/channels/${channel}/say/?message=${message}`, data => {
            console.log(this.connectedUser.nick + ' sent ' + data.message + ' to the channel ' + channel);            
        }, 'PUT');
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