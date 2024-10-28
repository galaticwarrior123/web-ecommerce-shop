import { Server } from "socket.io"



export class NotificationGateway {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("disconnect", () => {
                console.log("A user disconnected");
            });
        });
    }

    sendNotification(user, content, actionURL) {
        this.io.emit("notification", {
            user,
            content,
            actionURL
        });
    }
}