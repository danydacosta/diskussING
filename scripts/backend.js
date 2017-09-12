//**************BACKEND*********** */
console.log('backend.js loaded');

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