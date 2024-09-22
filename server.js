import app from "./app.js";
import dotenv from "dotenv";
import { mySqlPool } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;


mySqlPool
  .query("SELECT 1")
  .then(() => {

    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });

    process.on("SIGINT", () => {
      server.close(() => {
        console.log("Server closed");

        mySqlPool.end(() => {
          console.log("Database connection closed");
          process.exit(0);
        });
      });
    });

    process.on("SIGTERM", () => {
      server.close(() => {
        console.log("Server closed");
        mySqlPool.end(() => {
          console.log("Database connection closed");
          process.exit(0);
        });
      });
    });

  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
