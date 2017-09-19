//**************BACKEND*********** */
console.log('backend.js loaded');

let diskussing = null; // Singleton

class Diskussing{
    constructor(){
        if (!diskussing) {
            this.server = new Server();
            diskussing = this;
        }

        return diskussing;
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
        new Diskussing().server.channels.forEach(function(element) {
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
            new Diskussing().SwitchLoginPage(frontend);
            //Rafraichissement des notices
            setInterval(this.FetchNotices, 2000);
        }, 'POST');
    }
    
    FetchNotices(){ //Utilisation de chemin absolu de classe car la méthode est appelée depuis le callback de request
        //Requête au serveur
        new Diskussing().server.Request(`user/${new Diskussing().server.connectedUser.id}/notices`, data => {
            data.forEach(function(element) {
                console.log(element);
                switch(element.type){
                    case 'channelCreate':
                        console.log('[NOTICE] ' + element.channel.name + ' has been created!');
                        //Mise à jour des éléments dans la sidebar
                        new Diskussing().server.FetchChannels();
                    break;

                    case 'channelJoin':
                        console.log('[NOTICE] ' + element.nick + ' has been join the channel ' + element.channel.name);
                    break;

                    case 'channelMessage':
                        console.log('[NOTICE] ' + element.nick + ' has sent the message ' + element.message + ' in the channel ' + element.channel.name);
                        //Formate la date
                        let date = new Date(element.time);
                        let formatedDate = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2); 
                        //Ajoute le message dans le chat seulement si c'est un message entrant
                        if(new Diskussing().server.connectedUser.nick != element.nick)
                        {
                            //Ajoute un message dans l'objet salon
                            new Diskussing().server.AddMessageToChat(element.channel.name, element.nick, element.message, formatedDate);                            
                            //Ajout du message (graphiquement)
                            frontend.$('.chat ul').append(`<li class="message">
                                                                <hr class="messagesperarator">
                                                                <div class="messagetextcontent">
                                                                <label class="messagefrom">${element.nick} : </label>
                                                                <label class="messagecontent">${element.message}</label>
                                                                <label class="messagedate">${formatedDate}</label>
                                                                </div>
                                                            </li>`);
                        }

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
            
            //Si pas de nouveau salon depuis le dernier fetch, on ne fait rien
            let i = -1;
            data.forEach(function(element){ 
                i = i + 1;               
                var result = $.grep(new Diskussing().server.channels, function(element){ 
                    if(new Diskussing().server.channels[i] !== void 0){
                        return element.name == new Diskussing().server.channels[i].name; 
                    }else{
                        return 0;
                    }
                });

                if (result.length == 0) {
                    //Nouvel élément
                    console.log('New element "' + element.name + '" was found at index "' + i + '"');
                    new Diskussing().server.channels.push(new Channel(element.name, element.description, element.keep, element.owner));
                    new Diskussing().UpdateChannelSideBar();
                }
            });
        });
    }

    JoinChannel(channel){
        //Requête au serveur
        this.Request(`user/${this.connectedUser.id}/channels/${channel}/join/`, data => {
            console.log(this.connectedUser.nick + ' has join the channel ' + data.channel.name);
            //Affichage du chat
            new Diskussing().ShowChat(channel);
            //Ferme la sidebar
            new Diskussing().HideSidebar();
        }, 'PUT');
    }

    SendMessage(channel, message){
        //Requête au serveur
        this.Request(`user/${this.connectedUser.id}/channels/${channel}/say/?message=${message}`, data => {
            console.log(this.connectedUser.nick + ' sent ' + data.message + ' to the channel ' + channel);
            //Formate la date       
            let date = new Date();            
            let formatedDate = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2); 
            //Ajoute un message dans l'objet salon
            this.AddMessageToChat(channel, new Diskussing().server.connectedUser.nick, message, formatedDate);
            //Ajoute un message dans le chat(graphiquement)
            frontend.$('.chat ul').append(`<li class="message">
                                                <hr class="messagesperarator">
                                                <div class="messagetextcontent">
                                                <label class="messagefrom">${new Diskussing().server.connectedUser.nick} : </label>
                                                <label class="messagecontent">${message}</label>
                                                <label class="messagedate">${formatedDate}</label>
                                                </div>
                                            </li>`);  
                                            console.log(new Diskussing().server);  
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
                new Diskussing().ShowErrorModal(frontend, JSON.parse(xhr.responseText).error);
            }
        });
    }

    AddMessageToChat(channelName, fromNick, message, date){
        //Parcours la liste des salons et ajoute le message
        this.channels.forEach(function(element) {
            if(element.name == channelName){
                element.messages.push(new Message(fromNick, message, date));
            }
        });
    }
}