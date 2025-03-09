import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import router from './Routes/index.js';

dotenv.config();

const server = express();
const port = process.env.PORT || 5000;

// Middleware
server.use(express.json());
server.use(cors());

// Connect to Database
connectDB();

// Routes
server.get('/', (req, res) => res.send('Server is ready'));
server.use("/api", router);

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
