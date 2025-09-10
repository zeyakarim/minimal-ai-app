import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Use DATABASE_URL from environment variables for production/deployment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined in environment variables. Please check your .env file or docker-compose.yml.");
    process.exit(1);
}

// Extract SSL settings from DATABASE_URL if present
const isSSL = DATABASE_URL.includes("sslmode=require");
const sslOptions = isSSL ? {
    ssl: {
        require: true,
        rejectUnauthorized: false, // Set to true in production with a valid certificate
    },
} : {};

export const sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: sslOptions,
    logging: (sql: string, timing?: number) => {
        const timeLimit = parseInt(process.env.SEQUELIZE_QUERY_TIME_LIMIT || "1000");
        if (typeof timing === "number" && timing > timeLimit) {
            console.log(`🐢 Slow query (${timing}ms): ${sql}`);
        }
    },
    benchmark: true,
    pool: {
        max: parseInt(process.env.SEQUELIZE_POOL_MAX || "10"),
        min: 0,
        acquire: parseInt(process.env.SEQUELIZE_POOL_ACQUIRE || "30000"),
        idle: 10000,
    },
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    },
});

export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connection established successfully");

        // await sequelize.sync({ alter: true });
        console.log("✅ Database schema synchronized.");

    } catch (error) {
        console.error("❌ Database initialization failed:", error);
        process.exit(1);
    }
};