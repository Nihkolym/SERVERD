import db from "../../db/models/db";
import * as Sequelize from "sequelize";
import { IUser, User } from "../../users/models/User";
import { IOrganisation, Organisation } from "../../organisations/models/Organisation";

export interface IAnnouncement {
    id?: number;
    title: string;
    photo: string;
    geolocation: string;
    description: string;
    status: number;
    organizationId: number;
    ownerId: number;
    organization?: IOrganisation;
    owner?: IUser;
}

export const Announcement = db.define<IAnnouncement, IAnnouncement>("announcement", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
        },
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    geolocation: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
        },
    },
    ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    organizationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Organisation,
            key: "id",
        },
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            max: 7,
            min: 1,
        },
    },
});
