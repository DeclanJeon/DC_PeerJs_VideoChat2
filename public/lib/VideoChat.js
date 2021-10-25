const videoGrid = document.getElementById("video-grid");
const localVideoContainer = document.getElementById("local__video__container");
const localVideo = document.createElement("video");
localVideo.muted = true;
localVideo.id = "local__video";
localVideo.volume = 0;

const remoteVideoContainer = document.getElementById(
    "remote__video__container"
);

const peers = {};

let myVideoStream;
let myUserId;
let userCount = 0;
let front = false;

const flipCamera = document.getElementById("flipCamera");
flipCamera.addEventListener("click", () => {
    front = !front;
    console.log("front setting : " + front);
});

const constraints = {
    audio: {
        autoGainControl: false,
        channelCount: 2,
        echoCancellation: false,
        latency: 0,
        noiseSuppression: false,
        sampleRate: 48000,
        sampleSize: 16,
        volume: 1.0,
    },
    video: {
        facingMode: front ? "user" : "environment",
    },
};

const mediaDevices = navigator.mediaDevices;
const getUserMedia =
    mediaDevices.getUserMedia ||
    mediaDevices.webkitGetUserMedia ||
    mediaDevices.mozGetUserMedia;

function videoChatResult() {
    Call();
    copyInfo();
}

async function Call() {
    await getUserMedia(constraints)
        .then((stream) => {
            myVideoStream = stream;
            localVideo.autoplay = true;
            localVideo.setAttribute("playsinline", true);
            addVideoStream(localVideo, stream);
            peer.on("call", (call) => {
                call.answer(stream);
                const video = document.createElement("video");
                video.id = "remote__video";
                call.on("stream", (userVideoStream) => {
                    addVideoStream(video, userVideoStream);
                });
            });
            socket.on("user-connected", (userId) => {
                myUserId = userId;
                console.log("The User has been Connected. : ", userId);
                userCount = userCount + peer.connect.length;
                console.log("userCount : " + userCount);
                connectToNewUser(userId, stream);
            });
        })
        .catch((err) => {
            console.error(err);
        });

    socket.on("user-disconnected", (userId) => {
        if (peers[userId]) {
            peers[userId].close();
        }
    });

    peer.on("open", (id) => {
        console.log("voice chat on!");
        socket.emit("join-room", ROOM_ID, id);
    });

    peer.on("error", (err) => {
        console.log("error : " + err);
    });
}

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    //const selectVideoBox = document.getElementsByClassName(myUserId);
    video.id = "remote__video";
    video.autoplay = true;
    video.setAttribute("playsinline", true);
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });

    call.on("close", () => {
        video.remove();
        //selectVideoBox.remote__VideoBox.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    //const userName = document.createElement("div");
    //userName.id = "userName";
    //const videoBox = document.createElement("div");
    //videoBox.className = "videoBox";
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
    };

    if (video.id == "local__video") {
        //videoBox.id = "local__VideoBox";
        //videoBox.className = myUserId;
        //videoBox.append(video, userName);
        localVideoContainer.append(video);
        //userName.textContent = myUserId;
    } else if (video.id == "remote__video") {
        //videoBox.id = "remote__VideoBox";
        //videoBox.className = myUserId;
        //videoBox.append(video, userName);
        remoteVideoContainer.append(video);
        //userName.textContent = myUserId;
    } else {
        console.error("video output error");
    }
}

function copyInfo() {
    const copyIcon = document.getElementById("copyUrl");
    copyIcon.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        alert("The URL has been copied.");
    });
}

function videoSwitch() {
    const selectRemoteVideo = document.querySelector("remote__video");
    const selectLocalVideo = document.querySelector("local__video");

    selectRemoteVideo.addEventListener("click", () => {});
}

/******Result Code****** */
videoChatResult();
