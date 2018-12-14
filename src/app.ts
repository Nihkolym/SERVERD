import * as http from "http";
import { Server } from "http";
import DBService from "./lib/db/services/db-service";
import app from "./lib/server/models/express-application";
import AuthService from "./lib/authentication/services/auth-service";

const initApplication = async () => {
    try {
        const server: Server = http.createServer(app);

        await DBService.initDataBase();

        AuthService.setUpPassport();

        server.listen(process.env.PORT);
    } catch (error) {
        throw new Error("500");
    }
};

initApplication();
