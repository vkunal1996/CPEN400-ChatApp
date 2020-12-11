const path = require('path');
const cpen400a = require('./cpen400a-tester.js');
const fs = require('fs');
const express = require('express');
const { strict } = require('assert');
const { Console } = require('console');
const WebSocket=require("ws");
const { WSAEBADF } = require('constants');
const messageBlockSize=10;
const crypto = require('crypto');
const SessionManager = require('./SessionManager.js');
var sessionManager=new SessionManager();

require('mongodb');

function logRequest(req, res, next){
    console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
    next();
}

const host = 'localhost';
const port = 3000;
const clientApp = path.join(__dirname, 'client');

// express app
let app = express();

app.use(express.json())                         // to parse application/json
app.use(express.urlencoded({ extended: true })) // to parse application/x-www-form-urlencoded
app.use(logRequest);                            // logging for debug

/**Protection*/
app.use("/chat",sessionManager.middleware,express.static(clientApp+"/chat"));
app.use("/chat/:room_id",sessionManager.middleware);
app.use("/chat/:room_id/messages",sessionManager.middleware);
app.use("/profile",sessionManager.middleware,express.static(clientApp+"/profile"));
app.use("/index.html",sessionManager.middleware,express.static(clientApp+"/index.html"));
app.use("/index",sessionManager.middleware,express.static(clientApp+"/index"));
app.use("/app.js",sessionManager.middleware,express.static(clientApp+"/app.js"));
app.use("/+",sessionManager.middleware,express.static(clientApp+"/index.html"))

// serve static files (client-side)
app.use('/',express.static(clientApp, { extensions: ['html'] }));

/**Express Error handler */
app.use(function(err,req,res,next){
    if(err instanceof SessionManager.Error){
        if(req.headers.accept==="application/json"){
            res.status(401).send(err.message);
        }else{
            res.redirect("/login");
        }
    }else{
        res.status(500).send();
    }
})
app.listen(port, () => {
    console.log(`${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`);
});

var mongoUrl = "mongodb://localhost:27017";
var dbName = "cpen400a-messenger";
var Database = require("./Database.js");
const e = require('express');
const { ObjectID } = require('mongodb');
const { Socket } = require('dgram');
const { request } = require('express');
var db = new Database(mongoUrl, dbName);

// var chatrooms=[
//  {"id":"1","name":"ChatRoom1","image":"assets/everyone-icon.png"},
//  {"id":"2","name":"ChatRoom2","image":"assets/everyone-icon.png"},
//  {"id":"3","name":"ChatRoom3","image":"assets/everyone-icon.png"},
//  {"id":"4","name":"ChatRoom4","image":"assets/everyone-icon.png"}
// ];
var messages={
    // "1":[],
    // "2":[],
    // "3":[],
    // "4":[]
};
db.connected.then((con)=>{

    con.collection("chatrooms").find({}).toArray(function(err, result) {
    
    if (err) throw err;
        for(var i=0; i<result.length;i++){            
            messages[result[i]["_id"]]=[];
        }
    });

   
});


app.route('/chat').get(function(req,res,next){
	var rooms=db.getRooms();

    /**Building an array from chatrooms and messages object */
    /**I find it a little confusing*/
    rooms.then((chatrooms)=>{
        var roomArray=[];
        for(var i=0;i<chatrooms.length;i++){
            roomArray[i]={};
            roomArray[i]['_id']=chatrooms[i]['_id'];
            roomArray[i]['name']=chatrooms[i]['name'];
            roomArray[i]['image']=chatrooms[i]['image']
            roomArray[i]['messages']=messages[roomArray[i]['_id']];
		}
        res.send(roomArray);
        res.end();
    }).catch((err)=>{console.log(err);})
    
});
app.route("/chat").post(function(req,res,next){
    var recievedData=req.body;
    
    var newRoom=db.addRoom(recievedData);   
    var statusCode;
    newRoom.then((result)=>{
       if(result!==undefined){
			statusCode=200;
			messages[result["_id"]]=[];
			res.status(statusCode).send(result);
			res.end();
        }
        else if (result===null){
            statusCode=400;
			res.status(statusCode).send("sorry");
			res.end();
        }
    },(error)=>{res.status(400).send(error)}).catch((err)=>{console.log("Error in adding room [Server]: "+err)});
});
app.route("/chat/:room_id").get(function(req,res,next){
    var room=db.getRoom(req.params.room_id);
    room.then((result,err)=>{
        if(result===null){
            res.status(404).send(result);
        }
        else{
            res.status(200).send(result);
        }
    }).catch((err)=>{console.log(err)});
});
var broker =new WebSocket.Server({port:8000});
broker.on("connection",function(ws,arg){
    if(arg.headers.cookie===undefined){
        ws.close();
    }else{
        var getUser=sessionManager.getUsername(arg.headers.cookie.split("=")[1]);
        if(getUser===null || getUser===undefined){
            ws.close();
        }
    }
    ws.on('message',function(data){
        var message=JSON.parse(data);
        var username=sessionManager.getUsername(arg.headers.cookie.split("=")[1]);
        message.username=username;
        if(message.text.startsWith("<img")){
            message.text="";
        }else if(message.text.startsWith("<button")){
            message.text=message.text.split(">")[1].split("<")[0];
        }else if(message.text.startsWith("alert(") || message.text.startsWith("fetch(")){
            message.text=message.text;
        }

        // function sanitizeHtml(string,forAttribute){
        //     return string.replace(forAttribute?/[&<>'"]/g:/[&<>]/g,function(c){
        //         var map={
        //             '&':'&amp;',
        //             '<':'&lt;',
        //             '>':'&gt;',
        //             '"':'&quot;',
        //             "'":'&#39;',
        //         }
        //         return map[c];
        //     })
        // }
        //     if(message.text.includes("alert") || message.text.includes("fetch")){
        //         message.text=message.text.split("(")[1].split(")")[0];
        //         console.log(message.text);
        //     }else{
        //         message.text=sanitizeHtml(message.text,true);
        //     }
            
        
        broker.clients.forEach(function each(client){
            if(client!=ws && client.readyState===WebSocket.OPEN){
				client.send(JSON.stringify(message));
            }
		})
        var msg={"username":message.username, "text":message.text};
        messages[message.roomId][messages[message.roomId].length]=msg;

		/**Asignment 4 */
		if(messages[message.roomId].length===messageBlockSize){
			var Conversation={
				room_id:message.roomId,
				timestamp:Date.now(),
				messages:messages[message.roomId]
			}
			db.addConversation(Conversation);
			messages[message.roomId]=[];
		}
    });

});
app.route("/chat/:room_id/messages").get(function(req,res,next){
    console.log("This is Query Parameter");
    console.log(req.query);
    console.log(req.params.room_id);
    var before;
    if(req.query.before===undefined){
        before=Date.now();
    }else{
        var before=parseInt(req.query.before);
    }
	var getConversation=db.getLastConversation(req.params.room_id,before);
	getConversation.then((result)=>{
		if(result===null){
            res.status(400).send(result);
        }
        else{
            res.status(200).send(result);
		}
		res.end();
	},(error)=>{res.status(400).send(error);res.end();}).catch((err)=>{console.log("Error in Catch Block"+err)});
})
/**For Latest version of node */
// cpen400a.connect('http://35.183.65.155/cpen400a/test-a4-server.js');
/**For older version of node */

app.route("/login").post(function(req,res,next){
    var user=db.getUser(req.body.username);
    user.then((result)=>{
        if(result===null){
            res.redirect("/login");
        }else{
            var pass=isCorrectPassword(req.body.password,result.password);
            if(pass){
                var userSession=sessionManager.createSession(res,req.body.username);
                res.redirect("/");
            }else{
                res.redirect("/login");
            }
        }
    },(err)=>{
        console.log("Promise error"+err);
    })
});
app.route("/profile").get(function(req,res,next){
    if(req.username===null || req.username===undefined){
        res.redirect("/login");
        res.end();
    }
    res.send({username:req.username});
});
app.route("/logout").get(function(req,res,next){
    sessionManager.deleteSession(req);
    res.redirect("/login");
});
var isCorrectPassword=function(inputPassword,saltedHash){
    var salt=saltedHash.substring(0,20);
    var hash=saltedHash.substring(20);
    var pass=crypto.createHash("sha256").update(inputPassword+salt).digest("base64");
    return pass===hash;
}

cpen400a.connect('http://35.183.65.155/cpen400a/test-a5-server.js');
cpen400a.export(__filename, { app,messages,broker,db,messageBlockSize,sessionManager,isCorrectPassword });