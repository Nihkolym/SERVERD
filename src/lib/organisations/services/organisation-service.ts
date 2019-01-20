import { Address } from './../models/Organisation';
import { IAddress } from "../models/Organisation";
import { Organisation, IOrganisation } from "../models/Organisation";
import * as jwt from "jsonwebtoken";
import { State } from "../models/state";

export class OrganisationService {
    public static async getAllOrganisations(): Promise<IOrganisation[]> {
        return await Organisation.findAll({
            where: {
                active: State.Active,
            },
        });
    }

    public static async getOrganisation(organisationId: number): Promise<IOrganisation> {
        const organisation = await Organisation.findByPk(organisationId);

        if (organisation) {
            return organisation;
        } else {
            throw Error("500");
        }
    }

    public static async addOrganisation(model: IOrganisation): Promise<IOrganisation> {
        const organisation = await Organisation.create(model);

        if (organisation) {
            return organisation;
        } else {
            throw new Error("500");
        }
    }

    public static async deleteOrganisation(organisationId: number): Promise<void> {
        const res = await Organisation.destroy(
            {
                where: {
                    id: organisationId,
                },
            },
        );

        if (!res) {
            throw new Error("500");
        }
    }

    public static async addAddress(address: IAddress) {
        return await Address.create(address);
    }

    public static async updateOrganisation(model: IOrganisation, organisationId: number): Promise<void> {
        await Organisation.update(model,
            {
                where: {
                    id: organisationId,
                },
            },
        );
    }

    public static async getOrganisationByEmail(email: any): Promise<IOrganisation> {
        const user: IOrganisation | null = await Organisation.findOne({
            where: {
                email,
            },
        });

        if (user) {
            return user;
        } else {
            throw new Error("400");
        }
    }

    public static async getWaitingOrganisation(): Promise<IOrganisation[]> {
        return await Organisation.findAll({
            where: {
                active: State.UnActive,
            },
        });
    }

    public static async getOrganisationByToken(token: string): Promise<IOrganisation> {
        const body: any = jwt.decode(token);

        return await this.getOrganisationByEmail(body.email);
    }

    public static async changeStatus(organisationId: number, state: number): Promise<void> {
        await Organisation.update(
            { active: state },
            { where: { id: organisationId } },
        );
    }
}
