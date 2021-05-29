import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";

import passportConfig from "./config/passport.js";
import settings from "./config/keys.js";
import users from "./api/v1/users.js";

const app = express();

// Passport config
passportConfig(passport);

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Location of react app
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

// DB Configuration
const db = settings.mongoURI;

// Connect to MongoDB Atlas
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Routes for API
app.use("/api/v1/users", users);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
