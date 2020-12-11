const {
    MongoClient,
    ObjectID
} = require('mongodb'); // require the mongodb driver

/**
 * Uses mongodb v3.6+ - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.6/api/)
 * Database wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our cpen400a app.
 */
function Database(mongoUrl, dbName) {
    if (!(this instanceof Database)) return new Database(mongoUrl, dbName);
    this.connected = new Promise((resolve, reject) => {
        MongoClient.connect(
            mongoUrl, {
                useNewUrlParser: true
            },
            (err, client) => {
                if (err) reject(err);
                else {
                    console.log('[MongoClient] Connected to ' + mongoUrl + '/' + dbName);
                    resolve(client.db(dbName));
                }
            }
        )
    });
    this.status = () => this.connected.then(
        db => ({
            error: null,
            url: mongoUrl,
            db: dbName
        }),
        err => ({
            error: err
        })
    );
}

Database.prototype.getRooms = function() {
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            db.collection("chatrooms").find({}).toArray(function(err, rooms) {
                if (err) throw err;
                resolve(rooms);
            })
        })
    );
}

Database.prototype.getRoom = function(room_id) {
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            var collect = db.collection("chatrooms");
            try {
                var id = ObjectID(room_id);
                resolve(collect.findOne({
                    _id: id
                }));
            } catch (err) {
                try {
                    resolve(collect.findOne({
                        _id: room_id
                    }));
                } catch (err) {
                    resolve(null);
                }
            }
        })
    );
}

Database.prototype.addRoom = function(room) {
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            try {
                if (!room.hasOwnProperty("name")) {
                    throw "Error";
                }
                if (room["_id"] === undefined) {
                    room["_id"] = ObjectID();
                }
                db.collection("chatrooms").insertOne(room, function(res, err) {
                    resolve(room);
                });
            } catch (err) {
                reject("Rejected");
            }

        })
    );
}

Database.prototype.getLastConversation = function(room_id, before) {

    return this.connected.then(db =>
        new Promise(async (resolve, reject) => {
            if (before === undefined) {
                before = Date.now();
            }
            // var max = 0;
            var convo = db.collection("conversations").find({
                room_id: room_id,
                timestamp: {
                    $lt: before
                }
            });
            var minTimeDifference;
            convo.toArray(function(err, result) {
                var conversation = null;
				console.log(result);
                console.log(result);
                if (result.length > 0) {
                    minTimeDifference = Math.abs(before - result[0].timestamp);
                    if (result.length >= 1) {
                        for (var i = 0; i < result.length; i++) {
                            if (Math.abs(before - result[i].timestamp) <= minTimeDifference) {
                                minTimeDifference = Math.abs(before - result[i].timestamp);
                                conversation = result[i];
                            }
                        }
                    }
                }
                resolve(conversation);

            })
        })
    )
}

Database.prototype.addConversation = function(conversation) {
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            try {
                if (!conversation.hasOwnProperty("room_id") ||
                    !conversation.hasOwnProperty("timestamp") ||
                    !conversation.hasOwnProperty("messages")
                ) {
                    throw "Error";
                }
                if (conversation["_id"] === undefined) {
                    conversation["_id"] = ObjectID();
                }
                db.collection("conversations").insertOne(conversation, function(res, err) {
                    resolve(conversation);
                });
            } catch (err) {
                reject("Conversation Rejected.")
            }
        })
    )
}
Database.prototype.getUser=function(username){
    return this.connected.then(db=>
        new Promise ((resolve,reject)=>{
            var user=db.collection("users").findOne({username:username});
            resolve(user);
        })
    ) 
}
module.exports = Database;