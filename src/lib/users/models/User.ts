import { Announcement } from "./../../announcements/models/Announcement";
import db from "../../db/models/db";
import * as Sequelize from "sequelize";

export interface IUser {
    id?: number;
    email: string;
    firstName: string;
    avatar?: string;
    lastName: string;
    password: string;
    role: number;
}

export const User = db.define<IUser, IUser>("user", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
            len: [3, 255],
        },
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
        },
    },
    avatar: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [0, 255],
        },
    },
    role: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

Announcement.belongsTo(User, {
    foreignKey: "ownerId",
});
