const path = require('path');
const cpen400a = require('./cpen400a-tester.js');
const fs = require('fs');
const express = require('express');
const { strict } = require('assert');
const { Console } = require('console');
const WebSocket=require("ws");
const { WSAEBADF } = require('constants');

function logRequest(req, res, next){
	console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
	next();
}

const host = 'localhost';
const port = 3000;
const clientApp = path.join(__dirname, 'client');

// express app
let app = express();

app.use(express.json()) 						// to parse application/json
app.use(express.urlencoded({ extended: true })) // to parse application/x-www-form-urlencoded
app.use(logRequest);							// logging for debug

// serve static files (client-side)
app.use('/', express.static(clientApp, { extensions: ['html'] }));
app.listen(port, () => {
	console.log(`${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`);
});
var chatrooms=[
	{"id":"1","name":"ChatRoom1","image":"assets/everyone-icon.png"},
	{"id":"2","name":"ChatRoom2","image":"assets/everyone-icon.png"},
	{"id":"3","name":"ChatRoom3","image":"assets/everyone-icon.png"},
	{"id":"4","name":"ChatRoom4","image":"assets/everyone-icon.png"}
];
var messages={
	"1":[],
	"2":[],
	"3":[],
	"4":[]
};



app.route('/chat').get(function(req,res,next){

	/**Building an array from chatrooms and messages object */
	/**I find it a little confusing*/
	var roomArray=[];
	for(var i=0;i<chatrooms.length;i++){
		roomArray[i]={};
		roomArray[i]['id']=chatrooms[i]['id'];
		roomArray[i]['name']=chatrooms[i]['name'];
		roomArray[i]['image']=chatrooms[i]['image']
		roomArray[i]['messages']=messages[roomArray[i]['id']];
	}
	
	res.send(roomArray);
	res.end();
});
app.route("/chat").post(function(req,res,next){
	var recievedData=req.body;
	var newRoom={}
	if("name" in recievedData){
		/**Everytime id will be unique */
		newRoom['id']=Date.now().toString();
		newRoom['name']=recievedData['name'];
		newRoom['image']=recievedData['image'];
		chatrooms[chatrooms.length]=newRoom;
		messages[newRoom['id']]=[];
		res.status(200).send(newRoom);
	}
	else{
		res.status(400).send("Sorry");
	}
	res.end();
});
var broker =new WebSocket.Server({port:8000});
broker.on("connection",function(ws){
	ws.on('message',function(data){
		broker.clients.forEach(function each(client){
			if(client!=ws && client.readyState===WebSocket.OPEN){
				client.send(data);
			}
		})
		var obj=JSON.parse(data);
		var msg={"username":obj.username, "text":obj.text};
		messages[obj.roomId][messages[obj.roomId].length]=msg;
	});

});
/**For Latest version of node */
// cpen400a.connect('http://35.183.65.155/cpen400a/test-a3-server.js');
/**For older version of node */
cpen400a.connect('http://35.183.65.155/cpen400a/test-a3-server-node8.js');
cpen400a.export(__filename, { app,chatrooms,messages,broker });