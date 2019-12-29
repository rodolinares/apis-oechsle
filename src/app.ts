import bodyParser from "body-parser";
import express from "express";
import { body } from "express-validator";

import * as user from "./controllers/user";
import * as validator from "./util/validator";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoints
app.post("/creacliente", body(["birthDate", "firstName", "lastName"]).notEmpty(), validator.checkParams, user.create);
app.get("/kpideclientes", user.getUsers, user.avg, user.stDev, user.kpi);
app.get("/listclientes", user.list);

export default app;
