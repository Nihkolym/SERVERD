import db from "../models/db";

export default class DBService {
    public static async initDataBase() {
        try {
            await db.authenticate();
            await db.sync();

        } catch (err) {
            throw new Error("500");
        }
    }
}
