import { Request, Response } from "express";
import { OrganisationService } from "../services/organisation-service";
import { IOrganisation } from "../models/Organisation";
import { AnnouncementService } from "../../announcements/services/announcement-service";

export default class OrganisationController {
    public static async getAllOrganisations(req: Request, res: Response): Promise<void> {
        const organisations: IOrganisation[] = await OrganisationService.getAllOrganisations();

        res.status(200).send(organisations);
    }

    public static async getOrganisation(req: Request, res: Response): Promise<void> {
        const organisationId = req.params.id;

        const organisation: IOrganisation = await OrganisationService.getOrganisation(organisationId);

        res.status(200).send(organisation);
    }

    public static async deleteOrganisation(req: Request, res: Response): Promise<void> {
        const organisationId = req.params.id;

        await OrganisationService.deleteOrganisation(organisationId);

        res.status(200).send();
    }

    public static async updateOrganisation(req: Request, res: Response): Promise<void> {
        const organisationId = req.params.id;
        const model = req.body;

        await OrganisationService.updateOrganisation(model, organisationId);

        res.status(200).send();
    }

    public static async addOrganisation(req: Request, res: Response): Promise<void> {
        const model = req.body;

        const organisation = await OrganisationService.addOrganisation(model);

        res.status(200).send(organisation);
    }

    public static async getWaitingOrganisation(req: Request, res: Response): Promise<void> {
        res.status(200).send(await OrganisationService.getWaitingOrganisation());
    }

    public static async subscribeOnAnnouncement(req: Request, res: Response): Promise<void> {
        const announcementId = req.params.id;
        const organisationId = (await OrganisationService.getOrganisationByToken(req.headers.authorization)).id;

        AnnouncementService.subscribeOrganisation(announcementId, organisationId);

        res.status(200).send();
    }
}
