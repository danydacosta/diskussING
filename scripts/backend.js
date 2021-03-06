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
        frontend.$('.modaltitle').text('Create channel');
    }

    ShowEditChannelModal(title, description, keepChannel, owner){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.modal').toggleClass('displaynone');
        frontend.$('.channelownerlabel').toggleClass('displaynone');
        frontend.$('.channelowner').toggleClass('displaynone');
        frontend.$('.toggle').toggleClass('displaybehind');
        frontend.$('.modaltitle').text(`Edit ${frontend.$('.currentchannel').text()}`);
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
        this.server.FetchChannels(null);
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

    ShowChat(){
        frontend.$('.chat').toggleClass('displaynone');
    }

    ShowChannel(channelName){
        //Cache tous les autres salons
        frontend.$('.messagelist').each(function(i, obj) {
            $(this).addClass('displaynone');
        });

        //Affiche le salon désiré
        frontend.$(`.${channelName.replace(/ /g, "-")}`).toggleClass('displaynone');
        //Affiche le nom du salon comme titre
        frontend.$('.title').text(`${channelName}`);
        //Indique au frontend le salon actuellement affiché
        frontend.$('.currentchannel').text('');
        frontend.$('.currentchannel').text(`${channelName.replace(/ /g, "-")}`);
    }

    CreateChannel(channelName){
        //Cache tous les autres salons
        frontend.$('.messagelist').each(function(i, obj) {
            $(this).addClass('displaynone');
        });
        //génération d'un élément HTML "messagelist"
        frontend.$('.chat').append(`<ul class="messagelist ${channelName.replace(/ /g, "-")}"></ul>`);
        //Affiche le nom du salon comme titre
        frontend.$('.title').text(`${channelName}`);
        //Indique au frontend le salon actuellement affiché
        frontend.$('.currentchannel').text('');
        frontend.$('.currentchannel').text(`${channelName.replace(/ /g, "-")}`);
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
    
    FetchNotices(){
        //Requête au serveur
        new Diskussing().server.Request(`user/${new Diskussing().server.connectedUser.id}/notices`, data => {
            data.forEach(function(element) {
                //Variables redondantes
                let date;
                let formatedDate;
                switch(element.type){
                    case 'channelCreate':
                        console.log('[NOTICE] ' + element.channel.name + ' has been created!');
                        //Mise à jour des éléments dans la sidebar
                        new Diskussing().server.FetchChannels(null);
                    break;

                    case 'channelJoin':
                        console.log('[NOTICE] ' + element.nick + ' has been join the channel ' + element.channel.name);
                        //Formate la date
                        date = new Date(element.time);
                        formatedDate = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2); 
                        //Infos à afficher dans le chat
                        let message = `${element.nick} has joined the channel`;
                        //Ajoute un message dans l'objet salon
                        new Diskussing().server.AddMessageToChat(element.channel.name, 'Server', message, formatedDate); 
                        //Ajout du message (graphiquement)
                        frontend.$(`.${element.channel.name.replace(/ /g, "-")}`).append(`<li class="message">
                                                                                            <hr class="messagesperarator">
                                                                                            <div class="messagetextcontent">
                                                                                            <label class="messagecontent"><i>${message}</i></label>
                                                                                            <label class="messagedate">${formatedDate}</label>
                                                                                            </div>
                                                                                        </li>`);
                    break;

                    case 'channelMessage':
                        console.log('[NOTICE] ' + element.nick + ' has sent the message ' + element.message + ' in the channel ' + element.channel.name);
                        //Formate la date
                        date = new Date(element.time);
                        formatedDate = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2); 
                        //Ajoute le message dans le chat seulement si c'est un message entrant
                        if(new Diskussing().server.connectedUser.nick != element.nick)
                        {
                            //Ajoute un message dans l'objet salon
                            new Diskussing().server.AddMessageToChat(element.channel.name, element.nick, element.message, formatedDate);                            
                            //Ajout du message (graphiquement)
                            frontend.$(`.${element.channel.name.replace(/ /g, "-")}`).append(`<li class="message">
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

    FetchChannels(callback){
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
            //Retourne le callback seulement s'il a été passé en paramètre
            if(typeof callback === 'function'){
                callback();
            }
        });
    }

    JoinChannel(channelName, callback){
        //Détermine si l'utilisateur s'est déjà connecté à ce salon
        if(new Diskussing().server.GetChannelObjectFromName(new Diskussing().server.connectedUser.connectChannels, channelName) != null){
            //Affiche le salon
            new Diskussing().ShowChannel(channelName);
            //Ferme la sidebar
            new Diskussing().HideSidebar();
        } else {
            //Requête au serveur
            this.Request(`user/${this.connectedUser.id}/channels/${channelName}/join/`, data => {
                console.log(this.connectedUser.nick + ' has join the channel ' + data.channel.name);
                //Si c'est la première fois que l'utilisateur se connecte à un salon, on affiche "chat"
                if(typeof new Diskussing().server.connectedUser.connectChannels == 'undefined' || new Diskussing().server.connectedUser.connectChannels.length == 0){
                    new Diskussing().ShowChat();
                }
                //Si le salon n'a jamais été fetch (lorsque l'on crée un salon)
                if(new Diskussing().server.GetChannelObjectFromName(new Diskussing().server.channels, channelName) == null){
                    //On le fetch
                    new Diskussing().server.FetchChannels(function() {
                        //Ajout du salon dans la liste des salons connectés de l'utilisateur
                        new Diskussing().server.connectedUser.connectChannels.push(new Diskussing().server.GetChannelObjectFromName(new Diskussing().server.channels, channelName));
                    });
                } else {
                    //Ajout du salon dans la liste des salons connectés de l'utilisateur
                    new Diskussing().server.connectedUser.connectChannels.push(new Diskussing().server.GetChannelObjectFromName(new Diskussing().server.channels, channelName));
                }
                //Crée l'élément html salon
                new Diskussing().CreateChannel(channelName);
                //Ferme la sidebar
                new Diskussing().HideSidebar();
                //Retourne le callback seulement s'il a été passé en paramètre
                if(typeof callback === 'function'){
                    callback();
                }
            }, 'PUT');
        }
    }

    SendMessage(channelName, message){
        //Requête au serveur
        this.Request(`user/${this.connectedUser.id}/channels/${channelName}/say/?message=${message}`, data => {
            console.log(this.connectedUser.nick + ' sent ' + data.message + ' to the channel ' + channelName);
            //Formate la date       
            let date = new Date();            
            let formatedDate = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2); 
            //Ajoute un message dans l'objet salon
            this.AddMessageToChat(channelName, new Diskussing().server.connectedUser.nick, message, formatedDate);
            //Ajoute un message dans le chat(graphiquement)
            frontend.$(`.${channelName.replace(/ /g, "-")}`).append(`<li class="message">
                                                <hr class="messagesperarator">
                                                <div class="messagetextcontent">
                                                <label class="messagefrom"><b>${new Diskussing().server.connectedUser.nick}</b> : </label>
                                                <label class="messagecontent">${message}</label>
                                                <label class="messagedate">${formatedDate}</label>
                                                </div>
                                            </li>`);
        }, 'PUT');
    }

    CreateChannel(name, description, keepChannel){
        //Crée le salon (rejoint salon inexistant = crée)
        this.JoinChannel(name, function(){
            //Ferme la modal
            new Diskussing().CloseModal('modal');
            frontend.$('.blur').addClass('displaynone');
        });
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

    GetChannelObjectFromName(channelArray, channelName){
        //Parcours la liste des salons et cherche le salon avec le nom "channelName"
        for(var i = 0; i < channelArray.length; i++) {
            if(channelArray[i].name == channelName){
                return channelArray[i];
            }
        }

        return null;
    }
}