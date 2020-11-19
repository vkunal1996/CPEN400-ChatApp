function main() {
    /**Creating an object */
    var lobby = new Lobby();
    var socket = new WebSocket("ws://" + window.location.hostname + ":8000");
    // var socket=new WebSocket("ws://localhost:8000","p1");
    console.log("Connection Succeded");
    socket.addEventListener("message", (msg) => {
        var message = JSON.parse(msg.data);
        var getTheRoom = lobby.getRoom(message['roomId']);
        if (getTheRoom !== undefined || getTheRoom !== null) {
            getTheRoom.addMessage(message['username'], message['text']);
        }
    });
    var lobbyView = new LobbyView(lobby);
    var chatView = new ChatView(socket);
    var profileView = new ProfileView();


    this.renderRoute = function() {
        var path = window.location.hash;
        if (path.split("/")[1] === '' || path === '') {
            var elem = document.getElementById("page-view");
            emptyDOM(elem);
            elem.appendChild(lobbyView.elem);
        } else if (path.split("/")[1] === "chat") {
            var elem = document.getElementById("page-view");
            this.currentRoom = lobby.getRoom(path.split("/")[2]);
            if (this.currentRoom != null && typeof this.currentRoom === "object" && this.currentRoom !== undefined) {
                chatView.setRoom(this.currentRoom);
            }
            emptyDOM(elem);
            elem.appendChild(chatView.elem);
        } else if (path.split("/")[1] === "profile") {
            var elem = document.getElementById("page-view");
            emptyDOM(elem);
            elem.appendChild(profileView.elem);
        }
    }
    this.refreshLobby = () => {
        var getRoomsFromServer = Service.getAllRooms();
        getRoomsFromServer.then((rooms) => {

            for (var room = 0; room < rooms.length; room += 1) {
                var flag = 0;
                for (r in lobby.rooms) {
                    if (lobby.rooms[r]['id'] === rooms[room]['_id']) {
                        lobby.rooms[r]['name'] = rooms[room]['name'];
                        lobby.rooms[r]['image'] = rooms[room]['image'];
                        flag = 1;
                        break;
                    }
                }
                if (flag === 0) {
                    lobby.addRoom(rooms[room]['_id'], rooms[room]['name'], rooms[room]['image'],rooms[room]['messages']);
                }
            }
        }).catch(err => err);

    }

    window.addEventListener("popstate", this.renderRoute, false);
    this.renderRoute();

    this.refreshLobby();
    setInterval(this.refreshLobby, 6000);



    cpen400a.export(arguments.callee, {
        renderRoute,
        lobbyView,
        profileView,
        chatView,
        lobby,
        Lobby,
        Room,
        refreshLobby,
        socket
    });
}

function emptyDOM(elem) {
    while (elem.firstChild) elem.removeChild(elem.firstChild);
}

function createDOM(htmlString) {
    let template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

/** Object Oriented Programming*/


class LobbyView {

    constructor(lobby) {
        this.elem = createDOM(
            "<div class='content'>\
    <ul class='room-list'>\
      <li><a href='#/chat/room-1'><img src='assets/everyone-icon.png'>Everyone in CPEN400A</a></li>\
      <li><a href='#/chat/room-1'><img src='assets/bibimbap.jpg'>Foodies only</a></li>\
      <li><a href='#/chat/room-1'><img src='assets/minecraft.jpg'>Gamers unite</a></li>\
      <li><a href='#/chat/room-1'><img src='assets/canucks.png'>Canucks Fan</a></li>\
    </ul>\
    <div class='page-control'>\
      <input type='text'>\
      <button type='Submit'>Create Room</button>\
    </div>\
  </div>\
  "
        );
        this.listElem = this.elem.querySelector("ul.room-list");
        this.inputElem = this.elem.querySelector("input");
        this.buttonElem = this.elem.querySelector("button");
        this.lobby = lobby;



        this.lobby.onNewRoom = (room) => {

            this.room = room;
            var li = document.createElement("li");
            var img = document.createElement("img");
            var a = document.createElement("a");
            img.setAttribute("src", this.room.image);
            img.setAttribute("margin-left", "10px");
            img.setAttribute("width", "25px");
            img.setAttribute("height", "25px");
            a.appendChild(img);
            a.href = "#/chat/" + this.room["id"];
            a.appendChild(document.createTextNode(this.room.name));
            li.appendChild(a);
            // var listelem=document.querySelector("ul.room-list");
            this.listElem.appendChild(li);
            // listelem.appendChild(li);
        };

        this.redrawList();

        this.addEvent = this.addNewRoom.bind(this);
        this.buttonElem.addEventListener("click", this.addEvent, false);
    };
};
LobbyView.prototype.addNewRoom = function() {
    if (this.inputElem.value === "" || this.inputElem.value.trim() === "") {
        return;
    }
    var count = 0;
    for (var prp in this.lobby.rooms) {
        count += 1;
    }

    /**Client side adding the room */
    /**this.lobby.addRoom(count + 1, this.inputElem.value, undefined, undefined);*/

    /**Adding from the Server Side */
    var self = this;
    var getPromise = Service.addRoom({
        "name": self.inputElem.value,
        "image": "assets/everyone-icon.png"
    });

    getPromise.then(function(details) {
        self.lobby.addRoom(details['_id'], details['name'], undefined, undefined);
        self.inputElem.value = "";
    }).catch(err => err);



}

LobbyView.prototype.redrawList = function() {
    while (this.listElem.firstChild) {
        this.listElem.removeChild(this.listElem.firstChild);
    }
    var li;
    var img;
    var a;
    for (var i in this.lobby.rooms) {
        li = document.createElement("li");
        img = document.createElement("img");
        a = document.createElement("a");
        img.setAttribute("src", this.lobby.rooms[i].image);
        img.setAttribute("margin-left", "10px");
        img.setAttribute("width", "25px");
        img.setAttribute("height", "25px");
        a.appendChild(img);
        a.href = "#/chat/" + this.lobby.rooms[i]["id"];
        a.appendChild(document.createTextNode(this.lobby.rooms[i].name));
        li.appendChild(a);
        this.listElem.appendChild(li);

    }
};

class ChatView {
    constructor(socket) {
        this.elem = createDOM("\
  <div class='content'>\
  <h4 class='room-name'>Everyone in CPEN400A</h4> \
  <div class='message-list'>\
    <div class='message my-message'>\
          <span class='message-user'>\
              Alice\
          </span>\
          <span class='message-text'>\
              Hi Guys!\
          </span>\
      </div>\
      <div class='message'>\
          <span class='message-user'>\
              Bob\
          </span>\
          <span class='message-text'>\
              How is Everyone doing today?\
          </span>\
      </div>\
      <div class='message my-message'>\
          <span class='message-user'>\
              Alice\
          </span>\
          <span class='message-text'>\
              I am doing great! I just finished my project.\
          </span>\
      </div>\
      <div class='message'>\
          <span class='message-user'>\
              Charlie\
          </span>\
          <span class='message-text'>\
              Ugh.. I am still stuck trying to debug my sorting algorithm.\
          </span>\
      </div>\
      <div class='message'>\
          <span class='message-user'>\
              Bob\
          </span>\
          <span class='message-text'>\
              Do you need any help with that Charlie?\
          </span>\
      </div>\
      <div class='message my-message'>\
          <span class='message-user'>\
              Alice\
          </span>\
          <span class='message-text'>\
              I can help with that too.\
          </span>\
      </div>\
      </div>\
<div class='page-control'>\
  <textarea ></textarea>\
  <button type='Submit'>Send</button>\
</div>\
  ");
        this.socket = socket;
        this.titleElem = this.elem.querySelector("h4");
        this.chatElem = this.elem.querySelector("div.message-list");
        this.chatElem.style.minHeight="50%";
        this.chatElem.style.maxHeight="100%";
        this.inputElem = this.elem.querySelector("textarea");
        this.buttonElem = this.elem.querySelector("button");
        this.room = null;
        // this.sendMessageHandle=this.sendMessage.bind(this);
        this.buttonElem.addEventListener("click", () => {
            this.sendMessage.call(this);
        }, false);
        this.inputElem.addEventListener("keyup", (e) => {

            if (e.shiftKey === false) {
                if (e.keyCode === 13) {
                    this.sendMessage.call(this);
                }
            }

        }, false);
        this.chatElem.addEventListener("wheel",(e)=>{
            this.event=e;
           
           if(this.room.canLoadConversation===true && this.chatElem.scrollTop===0 && this.event.deltaY<0){
               console.log("Inside Wheel Event");
                var x=this.room.getLastConversation.next();
           }
        },false);
    };
}

ChatView.prototype.sendMessage = function() {
    this.text = this.inputElem.value;
    this.room.addMessage(profile.username, this.text);
    this.socket.send(JSON.stringify({
        "roomId": this.room['id'],
        "username": profile.username,
        "text": this.text
    }));
    this.inputElem.value = "";
}
ChatView.prototype.setRoom = function(room) {
    this.room = room;
    emptyDOM(this.titleElem);
    var title = document.createTextNode(this.room.name);
    this.titleElem.appendChild(title);
    /**Clearing DOM */
    emptyDOM(this.chatElem);


    if (this.room.messages.length != 0) {
        for (var i = 0; i < this.room.messages.length; i++) {
            var div = document.createElement("div");
            var span_user = document.createElement("span");
            var span_message = document.createElement("span");
            var messageText = document.createTextNode(this.room.messages[i].text);
            var messageUser = document.createTextNode(this.room.messages[i].username);
            span_user.append(messageUser);
            span_user.setAttribute("class", "message-user");
            span_message.append(messageText);
            span_message.setAttribute("class", 'message-text');
            div.appendChild(span_user);
            div.appendChild(span_message);

            if (this.room.messages[i].username === profile.username) {
                div.setAttribute("class", "message my-message");
            } else {
                div.setAttribute("class", "message");
            }
            this.chatElem.appendChild(div);
        }

    }


    // this.titleElem.appendChild(title);
    // this.titleElem.setAttribute("value",this.room.name);

    this.room.onNewMessage = (message) => {
        var div = document.createElement("div");
        var span_user = document.createElement("span");
        var span_message = document.createElement("span");
        var messageText = document.createTextNode(message.text);
        var messageUser = document.createTextNode(message.username);

        span_user.append(messageUser);
        span_user.setAttribute("class", "message-user");
        span_message.append(messageText);
        span_message.setAttribute("class", 'message-text');
        div.appendChild(span_user);
        div.appendChild(span_message);

        if (message.username === profile.username) {
            div.setAttribute("class", "message my-message");
        } else {
            div.setAttribute("class", "message");
        }
        this.chatElem.appendChild(div);
    }
    this.room.onFetchConversation=(conversation)=>{
        var ha=this.chatElem.scrollHeight;
        console.log("value of ha is "+ha);
        for(var i=conversation.messages.length-1;i>=0;i-=1){
            var message=conversation.messages[i];
            var div = document.createElement("div");
            var span_user = document.createElement("span");
            var span_message = document.createElement("span");
            var messageText = document.createTextNode(message.text);
            var messageUser = document.createTextNode(message.username);

            span_user.append(messageUser);
            span_user.setAttribute("class", "message-user");
            span_message.append(messageText);
            span_message.setAttribute("class", 'message-text');
            div.appendChild(span_user);
            div.appendChild(span_message);

            if (message.username === profile.username) {
                div.setAttribute("class", "message my-message");
            } else {
                    div.setAttribute("class", "message");
                }
            this.chatElem.prepend(div);
        }
        var hb=this.chatElem.scrollHeight;
        console.log("Value of hb is "+hb);
        this.chatElem.scrollTop=hb-ha;
    }
}
class ProfileView {
    constructor() {
        this.elem = createDOM(
            "<div class='content'>\
      <div class='profile-form'>\
      <div class='form-field'>\
          <label>Username</label>\
          <input type='text'/>\
      </div>\
      <div class='form-field'>\
            <label>Password</label>\
            <input type='password'/>\
      </div>\
      <div class='form-field'>\
            <label>Avatar Image</label>\
           <img src='assets/profile-icon.png'/> <input type='file'/>\
      </div>\
      <div class='form-field'>\
        <label>About</label>\
        <textarea></textarea>\
      </div>\
  </div>\
   <div class='page-control'>\
    <button type='Submit'>Submit</button>\
  </div>\
</div>");

    };
}
class Room {
    constructor(id, name, image = "assets/everyone-icon.png", messages = []) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.messages = messages;
        this.getLastConversation=makeConversationLoader(this);
        this.canLoadConversation=true;
        this.lastConversationTimeStamp=Date.now();
    }
}

Room.prototype.addMessage = function(username, text) {
    if (text === '' || text.trim() === '') {
        return;
    }
    var obj = {
        username: username,
        text: text
    }
    this.messages.push(obj);
    if (this.onNewMessage !== undefined) {
        this.onNewMessage(obj);
    }

}
Room.prototype.addConversation = function(conversation){
    for(var i=conversation.messages.length-1;i>=0;i-=1){
        this.messages.unshift(conversation.messages[i]);
    }
    if(this.onFetchConversation!==undefined){
        this.onFetchConversation(conversation);
    }
    // this.onFetchConversation=function(conversation){
    //     console.log("Onfetch");
    // };
    // this.onFetchConversation(this.messages);
    // var onFetchConversation=function(conversation);
}
class Lobby {
    constructor() {
        this.rooms = {
            /** Updating the lobby constructor to set it to empty object */
            // 1: new Room(1, "Everyone in CPEN400A", "assets/everyone-icon.png", []),
            // 2: new Room(2, "Foodies only", "assets/bibimbap.jpg", []),
            // 3: new Room(3, "Gamers unite", "assets/minecraft.jpg", []),
            // 4: new Room(4, "Canucks Fan", "assets/canucks.png", [])

        };
    }

}
Lobby.prototype.getRoom = function(roomid) {
    if (this.rooms[roomid] === null || this.rooms[roomid] === undefined) {
        return;
    }
    return this.rooms[roomid];
}

Lobby.prototype.addRoom = function(id, name, image, messages) {
    var room = new Room(id, name, image, messages);
    this.rooms[id] = room;
    if (this.onNewRoom !== undefined) {
        this.onNewRoom.call(Object.getPrototypeOf(LobbyView), this.rooms[id]);
    }

}
var profile = {
    username: "Alice"
};

var Service = {
    origin: window.location.origin,
    getAllRooms: function() {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            // request.responseType = 'json';
            request.open("GET", Service.origin + "/chat");
            request.onload = function() {
                if (request.status === 200) {
                    resolve(JSON.parse(request.responseText));
                }
                else{
                    reject(new Error(request.responseText));
                }
                // if (request.status === 500) {
                //     var err = new Error("Server Error 500: " + request.responseURL.split("/")[4]);
                //     reject(err);
                // }
            }
            request.onerror = function(e) {
                var err = new Error(request.responseText);
                reject(err);
            }
            request.send();

        });
    },
    addRoom: function(data) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open("POST", Service.origin + "/chat");
            // request.responseType = 'json';
            request.setRequestHeader("Content-Type", "application/json");
            request.onload = function() {
                if (request.status === 200) {
                    resolve(JSON.parse(request.responseText));
                }
                else{
                    reject (new Error(request.responseText));
                }
            }
            request.onerror = function(e) {
                var err = new Error(request.responseText);
                reject(err);
            }
            request.send(JSON.stringify(data));
        });

    },
    getLastConversation:function(roomId,before){
        return new Promise((resolve,reject)=>{
            var request=new XMLHttpRequest();
            request.open("GET",Service.origin+"/chat/"+roomId+"/messages?before="+before);
            request.onload = function() {
                console.log("In getLasconversation [app.js]");
                console.log(request.status);
                if (request.status === 200) {
                    resolve(JSON.parse(request.responseText));
                }
                else if (request.status===400){
                    /**Remove Rejected */
                    /**Instead resolving solve the problem of unhandled rejection */
                    resolve (null);
                }
            }
            request.onerror = function(e) {
                var err = new Error(request.responseText);
                reject(err);
            }
            request.send(roomId,before);
        });
    }
    
}

/**Adding Generator Function */
function *makeConversationLoader(room){
    console.log("Inside Generator function");
    console.log(room);

    var timestamp=room.lastConversationTimeStamp;
    // timestamp=timestamp===undefined?Date.now():timestamp;
    // room.canLoadConversation=room.canLoadConversation===undefined?true:room.canLoadConversation;
    // room.addConversation=room.addConversation===undefined?Room.addConversation:room.addConversation;
    console.log(timestamp);
    console.log("Starting Loop");
    while(timestamp>0 && room.canLoadConversation===true){
        console.log("Inside Loop");
        room.canLoadConversation=false;

        console.log("Calling Service.getLastConversation() inside Loop");
        convo=Service.getLastConversation(room.id,timestamp);
        convo.then((result)=>{
            if(result!==null){
                console.log("Conversation Recieved");
                console.log(result);
                room.addConversation(result);
                room.canLoadConversation=true;
                timestamp=result.timestamp;
            }
            if(result===null){
                console.log("Conversation is null");
                room.canLoadConversation=false;
            }
        },(err)=>{console.log("No more messages");})
        yield new Promise((resolve,reject)=>{
            if(convo!==null){
                resolve(convo);
            }
            else{
                resolve(null);
            }
        });
        
    }
    
}

window.addEventListener("load", main, false);