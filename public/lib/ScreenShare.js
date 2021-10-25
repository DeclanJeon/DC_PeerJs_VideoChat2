const shareScreenBtn = document.getElementById("shareScreen");
let userDisplayName;
let myScreenStream;

const displayMediaConfig = {
    video: {
        cursor: "always" | "motion" | "never",
        displaySurface: "application" | "browser" | "monitor" | "window",
    },
    audio: false,
};

function shareScreenBtnFunc() {
    shareScreenBtn.addEventListener("click", (e) => {
        shareScreen();
    });
}

function getDisplayMedia(options) {
    if (mediaDevices && mediaDevices.getDisplayMedia) {
        return mediaDevices.getDisplayMedia(options);
    }
    if (mediaDevices.getDisplayMedia) {
        return mediaDevices.getDisplayMedia(options);
    }
    if (mediaDevices.webkitGetDisplayMedia) {
        return mediaDevices.webkitGetDisplayMedia(options);
    }
    if (mediaDevices.mozGetDisplayMedia) {
        return mediaDevices.mozGetDisplayMedia(options);
    }
    throw new Error("getDisplayMedia is not defined");
}

const shareScreen = async () => {
    // if (adapter.browserDetails.browser == "firefox") {
    //     adapter.browserShim.shimGetDisplayMedia(window, "screen");
    // }
    let captureStream = null;

    try {
        captureStream = await mediaDevices.getDisplayMedia(displayMediaConfig);
        myScreenStream = captureStream;
        captureStream.style.transform = "none";
    } catch (err) {
        console.error("Error: " + err);
    }
    connectToNewUser(myUserId, captureStream);
    socket.emit("screenShare", captureStream);
};

/******* Result Code *******/
shareScreenBtnFunc();
