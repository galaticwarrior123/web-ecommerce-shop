import { Server } from 'socket.io';

class NotificationGateway {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Map lưu userId và danh sách socket.id
        this.userSockets = new Map();

        this.io.on('connection', (socket) => {

            // Lắng nghe sự kiện để ánh xạ userId với socket.id
            socket.on('register-user', (userId) => {
                if (!this.userSockets.has(userId)) {
                    this.userSockets.set(userId, new Set());
                }
                this.userSockets.get(userId).add(socket.id);
            });

            // Xóa socket.id khỏi Map khi ngắt kết nối
            socket.on('disconnect', () => {
                console.log('A user disconnected:', socket.id);
                for (const [userId, sockets] of this.userSockets.entries()) {
                    if (sockets.has(socket.id)) {
                        sockets.delete(socket.id);
                        if (sockets.size === 0) {
                            this.userSockets.delete(userId);
                        }
                        break;
                    }
                }
            });
        });
    }

    // Gửi thông báo đến userId cụ thể
    sendNotificationToUser(userId, notification) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.forEach((socketId) => {
                this.io.to(socketId).emit('new-notification', notification);
            });
        } else {
            console.log(`User ${userId} is not connected`);
        }
    }
}

export default NotificationGateway;