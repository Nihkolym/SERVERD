import * as express from "express";
import { Application, Router } from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import userRouter from "../../../lib/users/routes/user-router";
import announcementRouter from "../../../lib/announcements/routes/announcement-router";
import organisationRouter from "../../../lib/organisations/routes/organisation-router";
import * as passport from "passport";
import * as path from "path";
import { NextFunction } from "connect";

export class Server {
    public app: Application;

    private router: Router;

    constructor() {
        try {
            this.app = express();
            this.router = Router();

            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.use(bodyParser.json());
            this.app.use(express.static(path.resolve("public")));
            this.app.use(passport.initialize());

            this.app.use(cors());

            this.setRoutes();
        } catch (error) {
            global.console.log("Error");
        }
    }

    private setRoutes() {
        this.app.use("/api/v1", this.router);
        this.app.post("/fake", (req, res) => {
            const t = req.body;
        });
        this.router.use("/users", userRouter);
        this.router.use("/announcements", announcementRouter);
        this.router.use("/organisations", organisationRouter);
    }
}

const server = new Server();

export default new Server().app;
