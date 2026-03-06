const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const keepAlive = require('./services/keepAlive');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io integration
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Global mapping for active users
const onlineUsers = new Map();

// Make io accessible globally in controllers via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // When a user logs in, they emit 'setup' with their user ID
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        onlineUsers.set(userData._id, socket.id);
        socket.emit('connected');
        console.log(`User ${userData._id} mapped to socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);

        // Find and remove the disconnected socket from mapping
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});

// ✅ CORS — whitelist Vercel frontend + local dev
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL, // Set this in Render → e.g. https://medicare2-0.vercel.app
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, keep-alive bot)
        if (!origin) return callback(null, true);
        // Allow any vercel.app subdomain (preview deploys) or whitelisted origins
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));

// Health Check API
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

// Mount routers here...
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    keepAlive(); // 🤖 Ping /api/health every 14 min to prevent Render free-tier spin-down
});
