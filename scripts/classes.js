console.log('classes.js loaded');

class User{
    constructor(id, nick){
        this.id = id;
        this.nick = nick;
        this.connectChannels = [];
    }
}

class Channel{
    constructor(name, description, keep, owner){
        this.name = name;
        this.description = description;
        this.keep = keep;
        this.owner = owner;
        this.messages = [];
        this.notifications;
    }
}

class Message{
    constructor(sender, content, time){
        this.sender = sender;
        this.content = content;
        this.time = time;
    }
}