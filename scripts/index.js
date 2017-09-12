//**************FRONTEND*********** */
console.log('index.js loaded');

//Au lancement de l'extension, on signal au backend que le lancement de celle-ci.
document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({directive: "webextension-loaded"}, function(response) {
    });
});

/*let winViews = chrome.extension.getViews();
console.log(winViews);*/

/*class Diskussing{
    constructor(){
        this.connectState = "false";
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

    SwitchLoginPage(){
        $('.main-container').toggleClass('displaynone');
        $('.connect-container').toggleClass('displaynone');
    }

    UpdateChannelSideBar(){

    }

    ShowChat(){

    }

    HideChat(){

    }
}

let diskussing = new Diskussing();*/

//A l'excécution, va appeler l'état de l'interface contenue dans la classe diskussing de background.js
/*FetchUI();

function TalkToBackend(message){
    chrome.runtime.sendMessage(message,

        function (response) {
            console.log(response);
        }
    );
}

function FetchUI(){
    chrome.runtime.sendMessage("ui",
        
        function (response) {
            if(response == "true"){
                $('.main-container').toggleClass('displaynone');
                $('.connect-container').toggleClass('displaynone');
            }
        })
}*/

/*$('.toggle').click(() => {
    $('.blur').toggleClass('displaynone');
});

$('.connectbutton').click(() => {
    $('.main-container').toggleClass('displaynone');
    $('.connect-container').toggleClass('displaynone');
    TalkToBackend("true");
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
});*/