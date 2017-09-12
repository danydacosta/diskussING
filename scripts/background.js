class Diskussing{
    constructor(){
        this.connectState = "false";
        this.server = new Server();
    }

    ShowCreateChannelWindow(){

    }

    ShowEditChannelWindow(title, description, keepChannel, owner){

    }

    CloseWindow(){

    }

    ShowLoginPage(){
        
    }

    HideLoginPage(){

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
        this.connectedUser = new User();
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



let diskuss = new Diskussing();

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request == "ui"){
            sendResponse(diskuss.connectState);
        }else{
            diskuss.connectState = request;
        }
    }
);

$('.toggle').click(() => {
    $('.blur').toggleClass('displaynone');
});

$('.connectbutton').click(() => {
    $('.main-container').toggleClass('displaynone');
    $('.connect-container').toggleClass('displaynone');
});

$('.addbutton').click(() => {
    $('.blur').toggleClass('displaynone');
    $('.modal').toggleClass('displaynone');
    $('.toggle').toggleClass('displaybehind');
});

$('.modalclose').click(() => {
    $('.blur').toggleClass('displaynone');
    $('.modal').toggleClass('displaynone');
    $('.toggle').toggleClass('displaybehind');
});
