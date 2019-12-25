import express from "express";

import * as user from "./controllers/user";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

// Endpoints
app.post("/creacliente", user.create);
app.get("/kpideclientes", user.getUsers, user.avg, user.stDev, user.kpi);
app.get("/listclientes", user.list);

export default app;
