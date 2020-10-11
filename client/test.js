const __tester = {
    listeners: [],
    exports: new Map,
    defaults: {
        image: "assets/everyone-icon.png"
    },
    oldAddEventListener: HTMLElement.prototype.addEventListener,
    newAddEventListener: function(e, t, ...o) {
        return __tester.listeners.push({
            node: this,
            type: e,
            listener: t
        }), __tester.oldAddEventListener.call(this, e, t, ...o)
    },
    export: (e, t) => {
        __tester.exports.has(e) || __tester.exports.set(e, {}), Object.assign(__tester.exports.get(e), t)
    },
    setDefault: (e, t) => {
        __tester.defaults[e] = t
    }
};
HTMLElement.prototype.addEventListener = __tester.newAddEventListener, Window.prototype.addEventListener = __tester.newAddEventListener, window.cpen400a = {
    export: __tester.export,
    setDefault: __tester.setDefault
}, window.addEventListener("load", () => {
    const e = {
            "#/": (e, t, o = 1) => {
                let s = e.querySelector("div.content");
                if (!s) return t.comments.push("Could not observe Lobby Page: could not find div.content"); {
                    let e = s.querySelector("ul.room-list");
                    if (!e) return t.comments.push("Could not observe Lobby Page: could not find ul.room-list"); {
                        let o = e.querySelectorAll("li a");
                        if (0 === !o.length) return t.comments.push("Could not observe Lobby Page: could not find link to /#/chat/${roomId}");
                        if (!Array.from(o).find(e => 0 === e.attributes.href.nodeValue.indexOf("#/chat") || 0 === e.attributes.href.nodeValue.indexOf("/#/chat"))) return t.comments.push("Could not observe Lobby Page: could not find link to /#/chat/${roomId}")
                    }
                    let o = s.querySelector("div.page-control");
                    if (!o) return t.comments.push("Could not observe Lobby Page: could not find div.page-control");
                    if (!o.querySelector("input[type=text]")) return t.comments.push("Could not observe Lobby Page: could not find text input in div.page-control");
                    if (!o.querySelector("button")) return t.comments.push("Could not observe Lobby Page: could not find button in div.page-control")
                }
                t.score += o
            },
            "#/chat/room-1": (e, t, o = 1) => {
                let s = e.querySelector("div.content");
                if (!s) return t.comments.push("Could not observe Chat Page: could not find div.content"); {
                    s.querySelector("h4.room-name") || t.comments.push("Could not observe Chat Page: Could not find h4.room-name");
                    let e = s.querySelector("div.message-list");
                    if (!e) return t.comments.push("Could not observe Chat Page: could not find div.message-list");
                    if ("undefined" == typeof Room || "undefined" == typeof Lobby || "undefined" == typeof LobbyView || !LobbyView.prototype.redrawList || "undefined" == typeof ChatView || !ChatView.prototype.setRoom) {
                        let o = e.querySelector(".message:not(.my-message)");
                        if (!o) return t.comments.push("Could not observe Chat Page: could not find at least 1 div.message that is not div.my-message");
                        if (!o.querySelector("span.message-user")) return t.comments.push("Could not observe Chat Page: could not find span.message-user inside div.message");
                        if (!o.querySelector("span.message-text")) return t.comments.push("Could not observe Chat Page: could not find span.message-text inside div.message");
                        let s = e.querySelector(".my-message");
                        if (!s) return t.comments.push("Could not observe Chat Page: could not find at least 1 div.my-message");
                        if (!s.querySelector("span.message-user")) return t.comments.push("Could not observe Chat Page: could not find span.message-user inside div.my-message");
                        if (!s.querySelector("span.message-text")) return t.comments.push("Could not observe Chat Page: could not find span.message-text inside div.my-message")
                    }
                    let o = s.querySelector("div.page-control");
                    if (!o) return t.comments.push("Could not observe Chat Page: could not find div.page-control");
                    if (!o.querySelector("textarea")) return t.comments.push("Could not observe Chat Page: could not find textarea in div.page-control");
                    if (!o.querySelector("button")) return t.comments.push("Could not observe Chat Page: could not find button in div.page-control")
                }
                t.score += o
            },
            "#/profile": (e, t, o = 1) => {
                let s = e.querySelector("div.content");
                if (!s) return t.comments.push("Could not observe Profile Page: could not find div.content"); {
                    if (!s.querySelector("div.profile-form")) return t.comments.push("Could not observe Profile Page: could not find div.profile-form"); {
                        let e = s.querySelectorAll("div.form-field");
                        if (e.length < 1) return t.comments.push("Could not observe Profile Page: could not find at least 1 div.form-field inside div.profile-form");
                        if (!e[0].querySelector("label")) return t.comments.push("Could not observe Profile Page: could not find label inside div.form-field");
                        if (!e[0].querySelector("input")) return t.comments.push("Could not observe Profile Page: could not find input inside div.form-field")
                    }
                    let e = s.querySelector("div.page-control");
                    if (!e) return t.comments.push("Could not observe Profile Page: could not find div.page-control");
                    if (!e.querySelector("button")) return t.comments.push("Could not observe Profile Page: could not find button in div.page-control")
                }
                t.score += o
            }
        },
        t = () => ({
            id: Math.random().toString(),
            name: Math.random().toString(),
            image: __tester.defaults.image,
            messages: [{
                username: Math.random().toString(),
                text: Math.random().toString()
            }, {
                username: Math.random().toString(),
                text: Math.random().toString()
            }]
        }),
        o = [{
            id: "1",
            description: "Main function",
            maxScore: 1,
            run: async() => {
                let e = {
                        id: 1,
                        score: 0,
                        comments: []
                    },
                    t = document.querySelector('script[src="app.js"],script[src="/app.js"],script[src="./app.js"]');
                if (t)
                    if (main) {
                        e.score += .5, __tester.listeners.find(e => e.node === window && "load" === e.type && e.listener === main) ? e.score += .5 : e.comments.push('"main" not added as a listener on window "load" event')
                        console.log(__tester.listeners);
                    } else e.comments.push('Could not find "main"');
                else(t = document.querySelector('script[src="http://localhost:3000/app.js"],script[src="https://localhost:3000/app.js"],script[src="//localhost:3000/app.js"]')) ? e.comments.push("app.js is included using absolute URL") : e.comments.push("app.js script not found");
                return e
            }
        }, {
            id: "2",
            description: "Client-side Routing",
            maxScore: 4,
            run: async() => {
                let t = {
                    id: 2,
                    score: 0,
                    comments: []
                };
                if (main) {
                    let e = __tester.exports.get(main);
                    if (e)
                        if (e.renderRoute) {
                            let o = e.renderRoute;
                            if (o instanceof Function) {
                                t.score += .5, __tester.listeners.find(e => e.node === window && "popstate" === e.type && e.listener === o) ? t.score += .5 : t.comments.push('"renderRoute" not added as a listener on window "popstate" event')
                            } else t.comments.push('"renderRoute" should be a function')
                        } else t.comments.push('local variable "renderRoute" inside "main" was not found/exported');
                    else t.comments.push('Unable to test: local variables inside "main" were not exported')
                } else t.comments.push('Could not find "main"');
                let o = ["#/", "#/chat/room-1", "#/profile"],
                    s = document.querySelector("div#page-view");
                if (!s) return t.comments.push("Could not find div#page-view"), t;
                let i = window.location.hash,
                    r = s.innerHTML,
                    a = o.indexOf(i);
                a = a < 0 ? 2 : (a + 1) % 3;
                for (let i = 0; i < 3; i++) window.location.hash = o[a], await n(10), s.innerHTML === r ? t.comments.push("Could not observe content change when routing to " + o[a]) : e[o[a]](s, t), r = s.innerHTML, a = (a + 1) % 3;
                return window.location.hash = i, t
            }
        }, {
            id: "3",
            description: "View Model",
            maxScore: 4,
            run: async() => {
                let o = {
                    id: 3,
                    score: 0,
                    comments: []
                };
                if (LobbyView)
                    if (LobbyView instanceof Function) {
                        let s = t(),
                            n = new LobbyView({
                                rooms: [s]
                            });
                        if (n.elem instanceof HTMLElement) {
                            let t = document.createElement("template");
                            t.appendChild(n.elem), e["#/"](t, o, 1 / 3)
                        } else o.comments.push('"elem" property of a LobbyView instance should be an HTMLElement')
                    } else o.comments.push("LobbyView should be a class or a function");
                else o.comments.push("Could not find LobbyView");
                if (ChatView)
                    if (ChatView instanceof Function) {
                        let t = new ChatView;
                        if (t.elem instanceof HTMLElement) {
                            let s = document.createElement("template");
                            s.appendChild(t.elem), e["#/chat/room-1"](s, o, 1 / 3)
                        } else o.comments.push('"elem" property of a ChatView instance should be an HTMLElement')
                    } else o.comments.push("ChatView should be a class or a function");
                else o.comments.push("Could not find ChatView");
                if (ProfileView)
                    if (ProfileView instanceof Function) {
                        let t = new ProfileView;
                        if (t.elem instanceof HTMLElement) {
                            let s = document.createElement("template");
                            s.appendChild(t.elem), e["#/profile"](s, o, 1 / 3)
                        } else o.comments.push('"elem" property of a ProfileView instance should be an HTMLElement')
                    } else o.comments.push("ProfileView should be a class or a function");
                else o.comments.push("Could not find ProfileView");
                let s = {
                        lobbyView: LobbyView,
                        chatView: ChatView,
                        profileView: ProfileView
                    },
                    i = {},
                    r = __tester.exports.get(main);
                r ? Object.keys(s).forEach(e => {
                    r[e] ? (i[e] = r[e], r[e] instanceof s[e] ? o.score += .5 : o.comments.push('"' + e + '" should be an instance of ' + s[e].name)) : o.comments.push('local variable "' + e + '" inside "main" was not found/exported')
                }) : o.comments.push('Unable to test: local variables inside "main" were not exported');
                let a = [
                        ["#/", "lobbyView"],
                        ["#/chat/room-1", "chatView"],
                        ["#/profile", "profileView"]
                    ],
                    l = document.querySelector("div#page-view");
                if (!l) return o.comments.push("Could not find div#page-view"), o;
                let m = window.location.hash,
                    c = l.firstChild,
                    d = a.findIndex(e => e[0] === m);
                d = d < 0 ? 2 : (d + 1) % 3;
                for (let e = 0; e < 3; e++) window.location.hash = a[d][0], await n(10), l.firstChild === c ? o.comments.push("Could not observe content change when routing to " + a[d][0]) : i[a[d][1]] ? l.firstChild === i[a[d][1]].elem ? o.score += .5 : o.comments.push("Element rendered in " + a[d][0] + " is not the same as " + a[d][1] + ".elem") : o.comments.push('local variable "' + a[d][1] + '" inside "main" was not found/exported'), c = l.firstChild, d = (d + 1) % 3;
                return window.location.hash = m, o
            }
        }, {
            id: "4",
            description: "Element binding",
            maxScore: 2,
            run: async() => {
                let e = {
                    id: 4,
                    score: 0,
                    comments: []
                };
                if (ChatView)
                    if (ChatView instanceof Function) {
                        let t = new ChatView;
                        t.elem instanceof HTMLElement ? (t.titleElem ? t.elem.querySelector("h4.room-name") !== t.titleElem ? e.comments.push('"titleElem" property of a ChatView instance should be a reference to h4.room-name') : e.score += 2 / 7 : e.comments.push('Could not find "titleElem" property on a ChatView instance'), t.chatElem ? t.elem.querySelector("div.message-list") !== t.chatElem ? e.comments.push('"chatElem" property of a ChatView instance should be a reference to div.message-list') : e.score += 2 / 7 : e.comments.push('Could not find "chatElem" property on a ChatView instance'), t.inputElem ? t.elem.querySelector(".page-control textarea") !== t.inputElem ? e.comments.push('"inputElem" property of a ChatView instance should be a reference to the textarea inside div.page-control') : e.score += 2 / 7 : e.comments.push('Could not find "inputElem" property on a ChatView instance'), t.buttonElem ? t.elem.querySelector(".page-control button") !== t.buttonElem ? e.comments.push('"buttonElem" property of a ChatView instance should be a reference to the button inside div.page-control') : e.score += 2 / 7 : e.comments.push('Could not find "buttonElem" property on a ChatView instance')) : e.comments.push('"elem" property of a ChatView instance should be an HTMLElement')
                    } else e.comments.push("ChatView should be a class or a function");
                else e.comments.push("Could not find ChatView");
                if (LobbyView)
                    if (LobbyView instanceof Function) {
                        let o = t(),
                            s = new LobbyView({
                                rooms: [o]
                            });
                        s.elem instanceof HTMLElement ? (s.listElem ? s.elem.querySelector("ul.room-list") !== s.listElem ? e.comments.push('"listElem" property of a LobbyView instance should be a reference to ul.room-list') : e.score += 2 / 7 : e.comments.push('Could not find "listElem" property on a LobbyView instance'), s.inputElem ? s.elem.querySelector(".page-control input[type=text]") !== s.inputElem ? e.comments.push('"inputElem" property of a LobbyView instance should be a reference to the input[type=text] inside div.page-control') : e.score += 2 / 7 : e.comments.push('Could not find "inputElem" property on a LobbyView instance'), s.buttonElem ? s.elem.querySelector(".page-control button") !== s.buttonElem ? e.comments.push('"buttonElem" property of a LobbyView instance should be a reference to the button inside div.page-control') : e.score += 2 / 7 : e.comments.push('Could not find "buttonElem" property on a LobbyView instance')) : e.comments.push('"elem" property of a LobbyView instance should be an HTMLElement')
                    } else e.comments.push("LobbyView should be a class or a function");
                else e.comments.push("Could not find LobbyView");
                return e
            }
        }, {
            id: "5",
            description: "Object-Oriented Programming",
            maxScore: 7,
            run: async() => {
                let e = {
                    id: 5,
                    score: 0,
                    comments: []
                };
                if ("undefined" == typeof Room) e.comments.push("Could not find Room");
                else if (Room instanceof Function) {
                    e.score += .5;
                    let o = {
                            id: Math.random(),
                            name: Math.random(),
                            image: Math.random(),
                            messages: [{
                                username: Math.random().toString(),
                                text: Math.random().toString()
                            }, {
                                username: Math.random().toString(),
                                text: Math.random().toString()
                            }]
                        },
                        s = new Room(o.id, o.name, o.image, o.messages);
                    Object.keys(o).forEach(t => {
                        s[t] !== o[t] ? e.comments.push('Room constructor does not assign the given "' + t + '" argument to the "' + t + '" property of the Room instance') : e.score += .25
                    });
                    let n = new Room(o.id, o.name);
                    if (n.image !== __tester.defaults.image ? e.comments.push('Room constructor does not assign a default image url to the "image" property of the Room instance') : e.score += .25, n.messages instanceof Array && 0 === n.messages.length ? e.score += .25 : e.comments.push('Room constructor does not assign a default empty array to the "messages" property of the Room instance'), Room.prototype.addMessage)
                        if (Room.prototype.addMessage instanceof Function) {
                            e.score += .5;
                            let t = [];
                            for (let e = 0; e < 5; e++) t.push({
                                username: Math.random().toString(),
                                text: Math.random().toString()
                            });
                            let s = new Room(o.id, o.name);
                            s.messages = [];
                            try {
                                if (s.addMessage(t[0].username, t[0].text), 0 === s.messages.length) e.comments.push("No message was added to the Room instance after calling addMessage");
                                else {
                                    for (let e = 1; e < t.length; e++) s.addMessage(t[e].username, t[e].text);
                                    if (s.messages.length !== t.length) e.comments.push("called addMessage " + t.length + " times but the Room instance contains only " + s.messages.length + " messages");
                                    else {
                                        t.reduce((e, t, o) => e && t.username === s.messages[o].username && t.text === s.messages[o].text, !0) ? e.score += 1 : e.comments.push("addMessage is either adding messages out of order, adding the wrong values, or creating message objects incorrectly")
                                    }
                                }
                                s.messages = [], s.addMessage(t[0].username, ""), 0 !== s.messages.length ? e.comments.push("addMessage should not add any message if given an empty text") : e.score += .25, s.messages = [], s.addMessage(t[0].username, "    \t  \n  \t"), 0 !== s.messages.length ? e.comments.push("addMessage should not add any message if given a sequence of whitespaces") : e.score += .25
                            } catch (t) {
                                e.comments.push("Unexpected error when calling addMessage: " + t.message)
                            }
                        } else e.comments.push('"addMessage" should be a function');
                    else e.comments.push('Could not find a "addMessage" method (prototype function) in Room');
                    if ("undefined" == typeof Lobby) e.comments.push("Could not find Lobby");
                    else if (Lobby instanceof Function) {
                        e.score += .5;
                        let o, s = new Lobby;
                        if (s.rooms && Object.keys(s.rooms).length > 0) {
                            (o = Object.entries(s.rooms)).reduce((e, t) => e && t[1] instanceof Room, !0) ? e.score += .5 : e.comments.push('"rooms" property of a Lobby instance should contain an Associative Array of Room instances')
                        } else e.comments.push('Lobby constructor does not initialize a "rooms" property storing an Associative Array');
                        if (Lobby.prototype.getRoom) {
                            if (Lobby.prototype.getRoom instanceof Function) {
                                e.score += .5;
                                try {
                                    let t = s.getRoom(o[0][0]);
                                    t && t instanceof Room ? t.id !== o[0][1].id ? e.comments.push('"getRoom" not returning the correct Room instance') : e.score += .5 : e.comments.push('"getRoom" should return a Room')
                                } catch (t) {
                                    e.comments.push("Unexpected error when calling getRoom: " + t.message)
                                }
                            } else e.comments.push('"getRoom" should be a function');
                            if (Lobby.prototype.addRoom instanceof Function) {
                                e.score += .5;
                                try {
                                    let o = t();
                                    s.addRoom(o.id, o.name, o.image, o.messages);
                                    let n = s.rooms[o.id];
                                    n && n instanceof Room ? e.score += .5 : e.comments.push('"addRoom" not adding a Room object to the "rooms" Associative Array')
                                } catch (t) {
                                    e.comments.push("Unexpected error when calling addRoom: " + t.message)
                                }
                            } else e.comments.push('"addRoom" should be a function')
                        } else e.comments.push('Could not find a "getRoom" method (prototype function) in Lobby')
                    } else e.comments.push("Lobby should be a class or a function")
                } else e.comments.push("Room should be a class or a function");
                return e
            }
        }, {
            id: "6",
            description: "Dynamic HTML with MVC (Control-Model)",
            maxScore: 5,
            run: async() => {
                let e = {
                        id: 6,
                        score: 0,
                        comments: []
                    },
                    o = __tester.exports.get(main);
                if (o)
                    if (o.lobby) {
                        let s = o.lobby,
                            n = s.onNewRoom;
                        s instanceof Lobby ? e.score += .25 : e.comments.push('"lobby" should be a Lobby instance');
                        let i = new LobbyView(s);
                        i.lobby !== s ? e.comments.push('LobbyView constructor does not assign the given "lobby" argument to the "lobby" property of the Lobby instance') : e.score += .25;
                        let r = o.lobbyView;
                        if (r instanceof LobbyView ? r.lobby !== s ? e.comments.push('"lobby" should be passed as argument during "lobbyView" instantiation') : e.score += .25 : e.comments.push('"lobbyView" should be a LobbyView instance'), s.onNewRoom = n, LobbyView.prototype.redrawList)
                            if (LobbyView.prototype.redrawList instanceof Function) {
                                e.score += .5;
                                let o = new Lobby;
                                i.lobby = o, o.rooms = {};
                                for (let e = 0; e < 5; e++) {
                                    let e = t();
                                    o.rooms[e.id] = e
                                }
                                i.redrawList();
                                let s = i.listElem.querySelectorAll("li");
                                if (s.length !== Object.keys(o.rooms).length) e.comments.push('"redrawList" not rendering the right number of list items');
                                else {
                                    if (e.score += .25, Object.values(o.rooms).reduce((e, t) => e && !!i.listElem.querySelector('a[href="#/chat/' + t.id + '"],a[href="/#/chat/' + t.id + '"]'), !0)) {
                                        if (e.score += .5, i.redrawList(), i.listElem.querySelectorAll("li").length !== Object.keys(o.rooms).length) e.comments.push('"redrawList" not rendering the right number of list items');
                                        else {
                                            e.score += .25, Object.values(o.rooms).reduce((e, t) => e && !!i.listElem.querySelector('a[href="#/chat/' + t.id + '"],a[href="/#/chat/' + t.id + '"]'), !0) ? e.score += 1 : e.comments.push('list items rendered by "redrawList" does not contain hyperlinks to each of the rooms')
                                        }
                                    } else e.comments.push('list items rendered by "redrawList" does not contain hyperlinks to each of the rooms')
                                }
                                if ((s = (i = new LobbyView(o)).listElem.querySelectorAll("li")).length !== Object.keys(o.rooms).length) e.comments.push('"redrawList" not called inside constructor');
                                else {
                                    Object.values(o.rooms).reduce((e, t) => e && !!i.listElem.querySelector('a[href="#/chat/' + t.id + '"],a[href="/#/chat/' + t.id + '"]'), !0) ? e.score += .5 : e.comments.push('list items rendered by "redrawList" does not contain hyperlinks to each of the rooms')
                                }
                                if (__tester.listeners.find(e => e.node === i.buttonElem && "click" === e.type)) {
                                    e.score += .5;
                                    let t = Math.random().toString();
                                    i.inputElem.value = t, i.buttonElem.click(), Object.values(o.rooms).find(e => e.name === t) ? e.score += .5 : e.comments.push('Clicking "buttonElem" should add a new room in the "lobby" property of a LobbyView instance'), "" !== i.inputElem.value ? e.comments.push("The input should be cleared after adding the room") : e.score += .25
                                } else e.comments.push('Could not find a "click" event listener on "buttonElem"')
                            } else e.comments.push('"redrawList" should be a function');
                        else e.comments.push('Could not find a "redrawList" method (prototype function) in LobbyView')
                    } else e.comments.push('local variable "lobby" inside "main" was not found/exported');
                else e.comments.push('Unable to test: local variables inside "main" were not exported');
                return e
            }
        }, {
            id: "7",
            description: "Dynamic HTML with MVC (Model-View)",
            maxScore: 2,
            run: async() => {
                let e, o = {
                        id: 7,
                        score: 0,
                        comments: []
                    },
                    s = t(),
                    n = new Lobby;
                n.rooms = {}, await new Promise((t, i) => {
                    e = (e => {
                        e.id === s.id && e.name === s.name && e.image === s.image ? o.score += 1 : o.comments.push("onNewRoom should be called by passing the newly created Room instance"), t()
                    }), n.onNewRoom = e, n.addRoom(s.id, s.name, s.image, s.messages), i(new Error("onNewRoom event listener not invoked inside addRoom"))
                }), n.onNewRoom = null, n.rooms = {};
                let i = new LobbyView(n);
                if (n.onNewRoom)
                    if (n.onNewRoom instanceof Function) {
                        let e = [];
                        for (let o = 0; o < 5; o++) e.push(t()), n.addRoom(e[o].id, e[o].name, e[o].image, e[o].messages);
                        if (i.listElem.querySelectorAll("li").length !== Object.keys(n.rooms).length) o.comments.push("LobbyView not rendering the right number of list items ");
                        else {
                            Object.values(n.rooms).reduce((e, t) => e && !!i.listElem.querySelector('a[href="#/chat/' + t.id + '"],a[href="/#/chat/' + t.id + '"]'), !0) ? o.score += 1 : o.comments.push("list items rendered by LobbyView does not contain hyperlinks to each of the rooms")
                        }
                    } else o.comments.push('"onNewRoom" should be assigned a function');
                else o.comments.push('Inside LobbyView constructor, the "onNewRoom" property of the "lobby" object should be assigned a callback function');
                return o
            }
        }, {
            id: "8",
            description: "Dynamic HTML with MVC (for ChatView)",
            maxScore: 10,
            run: async() => {
                let e, o = {
                        id: 8,
                        score: 0,
                        comments: []
                    },
                    s = t(),
                    i = {
                        username: Math.random().toString(),
                        text: Math.random().toString()
                    },
                    r = new Room(s.id, s.name, s.image, s.messages);
                await new Promise((t, s) => {
                    e = (e => {
                        e.username === i.username && e.text === i.text ? o.score += .5 : o.comments.push("onNewMessage should be called by passing the newly created message object"), t()
                    }), r.onNewMessage = e, r.addMessage(i.username, i.text), s(new Error("onNewMessage event listener not invoked inside addMessage"))
                });
                let a = new ChatView;
                if (null !== a.room ? o.comments.push('ChatView constructor does not assign "null" to the "room" property') : o.score += .5, a.room = r, ChatView.prototype.sendMessage && ChatView.prototype.sendMessage instanceof Function) {
                    o.score += .5;
                    let t = Math.random().toString();
                    if (await new Promise((s, n) => {
                            e = (e => {
                                e.username === profile.username && e.text === t ? o.score += .5 : (o.comments.push("onNewMessage should be called by passing the newly created message object"), o.score += .25), s()
                            }), r.onNewMessage = e, a.inputElem.value = t, a.sendMessage(), n(new Error("onNewMessage event listener not invoked inside addMessage"))
                        }), Object.values(r.messages).find(e => e.text === t) ? o.score += .5 : o.comments.push('Clicking "buttonElem" should add a new message in the "room" object associated with the ChatView instance'), "" !== a.inputElem.value ? o.comments.push("The input should be cleared after adding the room") : o.score += .25, r.onNewMessage = null, __tester.listeners.find(e => e.node === a.buttonElem && "click" === e.type)) {
                        o.score += .25;
                        let e = ChatView.prototype.sendMessage;
                        await new Promise((e, t) => {
                            ChatView.prototype.sendMessage = (() => {
                                o.score += .5, e()
                            }), a.buttonElem.click(), t(new Error("Clicking buttonElem does not trigger sendMessage"))
                        }), ChatView.prototype.sendMessage = e
                    } else o.comments.push('Could not find a "click" event listener on "buttonElem" of the ChatView instance');
                    r.onNewMessage = null;
                    let s = __tester.listeners.find(e => e.node === a.inputElem && "keyup" === e.type);
                    if (s) {
                        o.score += .25;
                        let e = ChatView.prototype.sendMessage;
                        await new Promise((e, t) => {
                            ChatView.prototype.sendMessage = (() => {
                                t(new Error("Keyup with key other than the enter key should not trigger sendMessage"))
                            }), s.listener(new KeyboardEvent("keyup", {
                                keyCode: 15,
                                shiftKey: !1
                            })), e()
                        }), await new Promise((e, t) => {
                            ChatView.prototype.sendMessage = (() => {
                                t(new Error("Keyup with shift key pressed should not trigger sendMessage"))
                            }), s.listener(new KeyboardEvent("keyup", {
                                keyCode: 13,
                                shiftKey: !0
                            })), e()
                        }), await new Promise((e, t) => {
                            ChatView.prototype.sendMessage = (() => {
                                o.score += 1, e()
                            }), s.listener(new KeyboardEvent("keyup", {
                                keyCode: 13,
                                shiftKey: !1
                            })), t(new Error("Keyup with enter key without the shift key does not trigger sendMessage"))
                        }), ChatView.prototype.sendMessage = e
                    } else o.comments.push('Could not find a "keyup" event listener on "inputElem" of the ChatView instance')
                } else o.comments.push('Could not find a "sendMessage" method (prototype function) in ChatView');
                if (ChatView.prototype.setRoom && ChatView.prototype.setRoom instanceof Function) {
                    o.score += .25;
                    let e = t(),
                        s = t(),
                        i = new Room(e.id, e.name, e.image, e.messages),
                        r = new Room(s.id, s.name, s.image, s.messages),
                        a = new ChatView,
                        l = e => {
                            a.room !== e ? o.comments.push('"setRoom" should assign the given room to the "room" property of the ChatView instance') : o.score += .25, e.name !== a.titleElem.textContent ? o.comments.push('"setRoom" should display the given room name in "titleElem"') : o.score += .25;
                            let t = a.chatElem.querySelectorAll(".message .message-user"),
                                s = a.chatElem.querySelectorAll(".message .message-text");
                            if (t.length !== e.messages.length || s.length !== e.messages.length) o.comments.push("Chat list is not displaying the same number of messages as the messages in the Room instance");
                            else {
                                o.score += .25, e.messages.reduce((e, o, n) => e && t[n].textContent === o.username && s[n].textContent === o.text, !0) ? o.score += .25 : o.comments.push("Chat list is not displaying the messages correctly - potentially displaying out of order or with incorrect values")
                            }
                            let n = Math.random().toString();
                            e.addMessage(profile.username, n);
                            let i = a.chatElem.querySelectorAll(".my-message");
                            1 !== i.length ? o.comments.push("Expecting just 1 new message to be added, but found " + i.length + " messages") : (o.score += .25, i[0].querySelector(".message-text").textContent !== n ? o.comments.push("newly added message has the incorrect text") : o.score += .25)
                        };
                    a.setRoom(i), l(i), a.setRoom(r), l(r);
                    let m = __tester.exports.get(main);
                    if (m)
                        if (m.lobby) {
                            let e = m.lobby,
                                s = e.rooms,
                                i = {};
                            for (let e = 0; e < 4; e++) {
                                let e = t();
                                i[e.id] = new Room(e.id, e.name, e.image, e.messages)
                            }
                            e.rooms = i;
                            let r = document.querySelector("div#page-view");
                            if (!r) return o.comments.push("Could not find div#page-view"), o;
                            let a = window.location.hash,
                                l = r.firstChild;
                            for (let t in e.rooms) {
                                window.location.hash = "#/chat/" + t, await n(10), e.rooms[t].name === r.querySelector(".room-name").textContent ? o.score += .25 : o.comments.push("The name of the Room instance is not shown in heading");
                                let s = r.querySelectorAll(".message .message-user"),
                                    i = r.querySelectorAll(".message .message-text");
                                if (s.length !== e.rooms[t].messages.length || i.length !== e.rooms[t].messages.length) o.comments.push("Chat list is not displaying the same number of messages as the messages in the Room instance");
                                else {
                                    e.rooms[t].messages.reduce((e, t, o) => e && s[o].textContent === t.username && i[o].textContent === t.text, !0) ? o.score += .25 : o.comments.push("Chat list is not displaying the messages correctly - potentially displaying out of order or with incorrect values")
                                }
                                l = r.firstChild
                            }
                            e.rooms = s, window.location.hash = a
                        } else o.comments.push('local variable "lobby" inside "main" was not found/exported');
                    else o.comments.push('Unable to test: local variables inside "main" were not exported')
                } else o.comments.push('Could not find a "setRoom" method (prototype function) in ChatView');
                return o
            }
        }],
        s = (e, t) => {
            let o = document.createElement(e);
            return t && t.appendChild(o), o
        },
        n = e => new Promise((t, o) => setTimeout(t, e));
    let i = window.localStorage.getItem("store_a2");
    i = i ? JSON.parse(i) : {
        selection: {},
        results: {},
        lastTestAt: null
    };
    let r = {},
        a = s("div");
    a.style.position = "fixed", a.style.top = "0px", a.style.right = "0px";
    let l = s("button");
    l.textContent = "Test", l.style.backgroundColor = "red", l.style.color = "white", l.style.padding = "0.5em";
    let m = s("div");
    m.style.padding = "0.5em", m.style.position = "fixed", m.style.right = "0px", m.style.display = "flex", m.style.flexDirection = "column", m.style.backgroundColor = "white", m.style.visibility = "hidden";
    let c = s("table", m);
    c.style.borderCollapse = "collapse";
    let d = s("thead", c);
    d.style.backgroundColor = "dimgray", d.style.color = "white";
    let u = s("tr", d),
        h = s("th", u);
    h.textContent = "Task", h.style.padding = "0.25em";
    let p = s("th", u);
    p.textContent = "Description", p.style.padding = "0.25em";
    let g = s("th", u);
    g.textContent = "Run", g.style.padding = "0.25em";
    let f = s("th", u);
    f.textContent = "Result", f.style.padding = "0.25em";
    let y = s("tbody", c),
        b = s("tfoot", c),
        w = s("tr", b);
    w.style.borderTop = "1px solid dimgray";
    let C = s("th", w);
    C.textContent = "Total", C.colSpan = 3;
    let v = s("th", w);
    v.textContent = "-";
    let x = () => {
            let e = 0,
                t = 0;
            return o.forEach(o => {
                e += i.results[o.id].score, t += o.maxScore
            }), v.textContent = e + "/" + t, {
                sum: e,
                max: t
            }
        },
        L = s("button", m);
    L.id = "test-button", L.textContent = "Run Tests";
    let E = s("div", m);
    E.style.fontSize = "0.8em", E.style.textAlign = "right", i.lastTestAt && (x(), E.textContent = "Last Run at: " + new Date(i.lastTestAt).toLocaleString()), o.forEach((e, t) => {
        let o = s("tr", y);
        o.style.backgroundColor = t % 2 == 0 ? "white" : "#eee";
        let n = s("td", o);
        n.textContent = e.id, n.style.textAlign = "center", s("td", o).textContent = e.description;
        let a = s("td", o);
        a.style.textAlign = "center";
        let l = s("input", a);
        l.type = "checkbox", l.checked = e.id in i.selection && i.selection[e.id], l.addEventListener("change", t => {
            i.selection[e.id] = t.target.checked, window.localStorage.setItem("store_a2", JSON.stringify(i))
        });
        let m = s("td", o);
        m.style.textAlign = "center", m.textContent = e.id in i.results ? i.results[e.id].skipped ? "-" : i.results[e.id].score + "/" + e.maxScore : "-", r[e.id] = {
            checkBox: l,
            resultCell: m
        }
    }), a.appendChild(l), a.appendChild(m), L.addEventListener("click", async e => {
        L.disabled = !0, await
        function(e, t, o = 0) {
            let s = this,
                i = t || this,
                r = e.bind(i),
                a = async e => e === s.length ? null : (o > 0 && e > 0 && await n(o), await r(s[e], e, s), await a(e + 1));
            return a(0)
        }.call(o, async e => {
            let t = r[e.id].checkBox,
                o = r[e.id].resultCell;
            if (t.checked) {
                let t;
                L.textContent = "Running Test " + e.id;
                try {
                    (t = await e.run()) && t.comments.length > 0 && console.log("Task " + e.id + ":\n" + t.comments.map(e => "  - " + e).join("\n")), i.results[e.id] = {
                        skipped: !1,
                        score: t ? Math.round(100 * t.score) / 100 : 0,
                        comments: t ? t.comments : []
                    }
                } catch (t) {
                    i.results[e.id] = {
                        skipped: !1,
                        score: 0,
                        comments: ["Error while running tests: " + t.message]
                    }, console.log(t)
                }
            } else i.results[e.id] = {
                skipped: !0,
                score: 0,
                comments: []
            };
            o.textContent = i.results[e.id].skipped ? "Skipped" : Math.round(100 * i.results[e.id].score) / 100 + "/" + e.maxScore
        });
        let t = x();
        console.log(t.sum + " / " + t.max), i.lastTestAt = Date.now(), window.localStorage.setItem("store_a2", JSON.stringify(i)), E.textContent = "Last Run at: " + new Date(i.lastTestAt).toLocaleString(), L.textContent = "Run Tests", L.disabled = !1
    }), l.addEventListener("click", e => "hidden" == m.style.visibility ? m.style.visibility = "visible" : m.style.visibility = "hidden"), document.body.appendChild(a)
});