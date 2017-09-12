//**************FRONTEND*********** */
console.log('index.js loaded');

//Au lancement de l'extension, on signal au backend que le lancement de celle-ci.
document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({directive: "webextension-loaded"}, function(response) {
    });
});
