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
        frontend.$('.toggle').toggleClass('displaybehind');
    }

    CloseModal(frontend, modal){
        frontend.$('.blur').toggleClass('displaynone');
        frontend.$('.' + modal).toggleClass('displaynone');
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
        this.socket;
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

    Request(url, callback, type = 'GET', baseUrl = 'http://localhost:8081/'){
        $.ajax({
            url: baseUrl + url.split('?')[0],
            type: type,
            data: url.split('?')[1],

            success: data => {
                callback(data)
            },
            error: data => {
                console.log('Error ' + data);
            }
        })
    }
}