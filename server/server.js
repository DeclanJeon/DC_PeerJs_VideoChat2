const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { nanoid } = require("nanoid");
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "/",
        methods: ["GET", "POST"],
    },
});

const port = process.env.PORT || 3030;
const roomID = nanoid();

app.set("view engine", "ejs");

app.use(cors());

app.use(express.static("public"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));
app.use(express.static("public/lib"));

app.get("/", (req, res) => {
    res.redirect(`${roomID}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.emit("user-connected", userId);
        console.log("BoardCast User Connected : ", userId);

        socket.on("disconnect", () => {
            socket.broadcast.emit("user-disconnected", userId);
            console.log("BoardCast User Disconnected : ", userId);
        });

        socket.on("new message", (msg) => {
            io.to(roomId).emit("send message", {
                message: msg,
                user: socket.username,
            });
        });

        socket.on("screen-share", (stream) => {
            io.to(roomId).emit("screenShare", stream, userId);
        });
    });

    socket.on("new user", (user) => {
        socket.username = user;
        console.log("User connected - User name: " + socket.username);
    });
});

server.listen(port, () => {
    console.log(`Server Listener... ${port}`);
});
