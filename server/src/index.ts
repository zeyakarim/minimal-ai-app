import cors from "cors";
import express from "express";
import { AuthRoutes } from "./auth/routes";
import { ChatRoutes } from "./chats/routes";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const origins = JSON.parse(
    process.env.origins ||
    '["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "https://minimal-ai-app.vercel.app", "https://minimal-ai-app.onrender.com"]'
);

const app = express();
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || origins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Allow-Origin",
            "X-Forwarded-For",
            "user",
        ],
    })
);

app.use(
    express.json({
        limit: "1024mb",
    })
);

app.use(express.urlencoded({ extended: true }));

app.use('/auth', AuthRoutes);
app.use('/chat', ChatRoutes);

app.get('/', (req, res) => {
    res.send('AI Chat Backend is running.');
});

export default app;