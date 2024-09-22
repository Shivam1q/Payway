import express from "express";

import mainRouter from "./routes/index.js"

const app = express();

app.use("/api/v1", mainRouter);