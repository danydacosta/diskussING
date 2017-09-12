//**************FRONTEND*********** */
//A l'excécution, va appeler l'état de l'interface contenue dans la classe diskussing de background.js
FetchUI();

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
}

$('.toggle').click(() => {
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
});