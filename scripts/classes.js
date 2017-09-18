console.log('classes.js loaded');

class User{
    constructor(id, nick){
        this.id = id;
        this.nick = nick;
        this.connectChannels = [];
    }
}

class Channel{
    constructor(){
        this.name;
        this.description;
        this.keep;
        this.owner;
        this.messages = [];
        this.notifications;
    }
}

class Message{
    constructor(){
        this.sender;
        this.content;
        this.time;
    }
}