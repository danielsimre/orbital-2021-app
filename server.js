import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import passportConfig from "./config/passport.js";
import users from "./api/v1/users.js";
import projects from "./api/v1/projects.js";

const app = express();
dotenv.config();

// Passport config
passportConfig(passport);

// CORS Middleware
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());

// Express Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secret"));
// PassportJS Middleware
app.use(passport.initialize());
app.use(passport.session());

// End of Middleware Section

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Routes for API
app.use("/api/v1/users", users);
app.use("/api/v1/projects", projects);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

const port = process.env.PORT || 5000;

// For use in Heroku app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Server started on port ${port}`));
