import express from "express";
import bodyParser from "body-parser";
import { mySqlPool as db } from "./config/database.js";

const app = express();

app.use(bodyParser.json());

app.use("/register", async (req, res) => {
  try {
    const { name, address, city, state, country, pincode } = req.body;

    if (!name || !address || !city || !state || !country || !pincode) {
      return res.status(400).json({
        success: "false",
        message: "Please enter all details",
      });
    }

    const [userResult] = await db.query("INSERT INTO user (name) VALUES(?)", [
      name,
    ]);

    if (!userResult.affectedRows) {
      return res.status(500).json({
        success: false,
        message: "Error while registering user. Please try again",
      });
    }

    const userId = userResult.insertId;

    const [addressResult] = await db.query(
      "INSERT INTO user_address (userId, address, city, state, country, pincode) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, address, city, state, country, pincode]
    );

    if (!addressResult.affectedRows) {
      return res.status(500).json({
        success: false,
        message: "Error while adding address. Please try again",
      });
    }

    res.status(201).json({
      success: "true",
      message: "User has been successfully registerd!",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

export default app;
