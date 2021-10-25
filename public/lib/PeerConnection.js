const socket = io("/");

let conn;
let username;

socket.on("connect", () => {
    console.log("Socket ID:::::::" + socket.id);
});

const peer = new Peer(undefined, {
    initiator: true,
    trickle: false,
    path: "/",
    host: "0.peerjs.com",
    port: "443",
    //path: "/peerjs",
    //host: "localhost",
    //port : "1337",
    pingInterval: 5000,
    config: {
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            },
            {
                urls: "turn:192.158.29.39:3478?transport=udp",
                credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                username: "28224511:1379330808",
            },
        ],
        sdpmantics: "unified-plan",
        //iceTransportPolicy: "relay", // <- this is a hint for WebRTC to use the relay server
    },

    debug: 3,
});

function connectPeers() {
    username = window.prompt("Please enter the sharing PeerId");
    socket.emit("new user", username);
    conn = peer.connect(username);
    peer.on("connection", (connection) => {
        conn = connection;
    });
}

/************Result Code********** */

connectPeers();
