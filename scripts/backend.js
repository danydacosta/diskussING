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
        this.address;
        this.channels = [];        
    }

    Connect(socket, name){
        //Set l'adresse du serveur qui sera utilisée pour les prochaines requêtes
        this.address = socket;

        //Requête au serveur
        this.Request(`users/regisster/${name}/`, data => {
            //Enregistrement de l'utilisateur
            this.connectedUser = new User(data.id, data.nick);
            console.log(this.connectedUser);
            //Affichage de l'interface principale
            diskussing.SwitchLoginPage(frontend);
        }, 'POST');
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