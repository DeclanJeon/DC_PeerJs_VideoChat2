const videoGrid = document.getElementById("video-grid");
const localVideoContainer = document.getElementById("local__video__container");
const localVideo = document.createElement("video");
const remoteVideoContainer = document.getElementById(
    "remote__video__container"
);

const userName = document.getElementById("userName");
let remoteUserName = document.createElement("div");
remoteUserName.setAttribute("id", "remoteUserName");

localVideo.id = "local__video";
localVideo.volume = 0;

let conn;
let peers = {};
let myVideoStream;
let myUserId;

const constraints = {
    audio: {
        autoGainControl: true,
        channelCount: 2,
        echoCancellation: true,
        latency: 0,
        noiseSuppression: true,
        sampleRate: 48000,
        sampleSize: 16,
        volume: 1.0,
    },
    video: true,
};

const mediaDevices = navigator.mediaDevices;
const getUserMedia =
    mediaDevices.getUserMedia ||
    mediaDevices.webkitGetUserMedia ||
    mediaDevices.mozGetUserMedia;

function videoChatResult() {
    Call();
}

async function Call() {
    try {
        const stream = await getUserMedia(constraints);
        myVideoStream = stream;
        addVideoStream(localVideo, stream);

        peer.on("call", (call) => {
            call.answer(stream);
            const remoteVideo = document.createElement("video");
            remoteVideo.setAttribute("id", "remote__video");
            remoteVideo.volume = 0;

            call.on("stream", (userVideoStream) => {
                addVideoStream(remoteVideo, userVideoStream);
            });
        });

        socket.on("user-connected", (userId) => {
            userDisplayName = userId;
            myUserId = userId;
            console.log("The User has been Connected. : ", userId);
            userCount = userCount + peer.connect.length;
            console.log("userCount : " + userCount);
            socket.emit(
                "new message",
                "The User has been Connected. " + username
            );
            socket.emit("new message", "The User Count " + userCount);
            connectToNewUser(userId, stream);
        });

        socket.on("user-disconnected", (userId) => {
            if (peers[userId]) {
                peers[userId].close();
                socket.emit(
                    "new message",
                    "The User has been Disconnected. " + peers[userId]
                );
            }
        });
    } catch (err) {
        console.error(err);
    }
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });

    if (video.id == "local__video") {
        localVideoContainer.append(video);
        userName.textContent = peer.id;
    } else {
        const remoteVideoBox = document.createElement("div");
        remoteVideoBox.id = "remote__Video__Box";
        remoteVideoBox.append(video, remoteUserName);
        remoteVideoContainer.append(remoteVideoBox);
    }
}

function connectToNewUser(userId, stream) {
    console.log("connectToNewUser : " + userId);
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    video.setAttribute("id", "remote__video");
    video.volume = 0;
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
        remoteUserName.textContent = userId;
    });
    call.on("close", () => {
        video.remove();
    });
}

/******Result Code****** */
videoChatResult();
