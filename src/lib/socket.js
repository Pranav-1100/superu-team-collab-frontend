import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_API_URL, {
        auth: {
          token
        }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  joinDocument(documentId) {
    if (this.socket) {
      this.socket.emit('join_document', { documentId });
    }
  }

  leaveDocument(documentId) {
    if (this.socket) {
      this.socket.emit('leave_document', { documentId });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;