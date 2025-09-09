import dotenv from "dotenv";
import http from "http";
import { initializeDatabase } from "./src/db/config";
import app from "./src/index";

dotenv.config();

const port: number = parseInt(process.env.PORT || "3002", 10);
const server = http.createServer(app);

(async () => {
    try {
        await initializeDatabase();

        server.listen(port, "0.0.0.0", () => {
            console.log(`Server running at http://0.0.0.0:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();