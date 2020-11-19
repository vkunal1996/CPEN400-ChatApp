const path = require('path');
const cpen400a = require('./cpen400a-tester.js');
const fs = require('fs');
const express = require('express');
const { strict } = require('assert');
const { Console } = require('console');
const WebSocket=require("ws");
const { WSAEBADF } = require('constants');
const messageBlockSize=10;
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

// serve static files (client-side)
app.use('/', express.static(clientApp, { extensions: ['html'] }));
app.listen(port, () => {
    console.log(`${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`);
});

var mongoUrl = "mongodb://localhost:27017";
var dbName = "cpen400a-messenger";
var Database = require("./Database.js");
const e = require('express');
const { ObjectID } = require('mongodb');
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
broker.on("connection",function(ws){
    ws.on('message',function(data){
        broker.clients.forEach(function each(client){
            if(client!=ws && client.readyState===WebSocket.OPEN){
				client.send(data);
            }
		})
		var message=JSON.parse(data);
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
	var before=parseInt(req.query.before);
	var getConversation=db.getLastConversation(req.params.room_id,before);
	getConversation.then((result)=>{
        console.log("Inside route");
        console.log(result);
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



cpen400a.connect('http://35.183.65.155/cpen400a/test-a4-server.js');
cpen400a.export(__filename, { app,messages,broker,db,messageBlockSize });