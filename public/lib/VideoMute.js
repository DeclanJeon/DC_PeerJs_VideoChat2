const videoBtn = document.getElementById("muteVideo");
const audioBtn = document.getElementById("muteAudio");

const videoIcon = document.getElementById("videoIcon");
const audioIcon = document.getElementById("audioIcon");

const handlerMuteControler = () => {
    videoBtn.addEventListener("click", () => {
        handlerVideoMute();
    });
    audioBtn.addEventListener("click", () => {
        handlerAudioMute();
    });
};

const handlerAudioMute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        audioIcon.className = "fa fa-microphone-slash";
        console.log("AudioTrack Mute : " + enabled);
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        audioIcon.className = "fa fa-microphone";
        console.log("AudioTrack Mute : " + enabled);
    }
};

const handlerVideoMute = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        videoIcon.className = "fas fa-video-slash";
        console.log("VideoTrack Mute : " + enabled);
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        videoIcon.className = "fas fa-video";
        console.log("VideoTrack Mute : " + enabled);
    }
};

/*********  Result Code ******* */
handlerMuteControler();
