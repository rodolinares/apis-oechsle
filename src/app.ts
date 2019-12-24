import express from "express";

import * as userController from "./controllers/user";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

// Endpoints
app.post("/creacliente", userController.createUser);
app.get("/kpideclientes", userController.readUser);
app.get("/listclientes", userController.listUsers);

export default app;
