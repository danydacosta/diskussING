class User{
    constructor(){
        this.id;
        this.nick;
        this.connectChannels[];
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
        this.isCurrentChannel;
    }
}

class Message{
    constructor(){
        this.sender;
        this.content;
        this.time;
    }
}