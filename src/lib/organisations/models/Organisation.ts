import db from "../../db/models/db";
import * as Sequelize from "sequelize";

export interface IOrganisation {
    id?: number;
    email: string;
    password: string;
    name: string;
    phone: string;
    description?: string;
    logo?: string;
    address?: string;
    role: number;
    active: number;
    certificate: string;
}

export const Organisation = db.define<IOrganisation, IOrganisation>("organisation", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    description: {
        type: Sequelize.STRING,
        validate: {
            len: [3, 255],
        },
    },
    address: {
        type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
        },
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 255],
        },
    },
    logo: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
        },
    },
    active: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    certificate: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});
