import { OrganisationService } from './../../organisations/services/organisation-service';
import { Request, Response } from "express";
import { AnnouncementService } from "../services/announcement-service";
import { IAnnouncement } from "../models/Announcement";
import { Status } from "../models/status";
import { UserService } from "../../users/services/user-service";

export default class AnnouncementController {
    public static async getAllAnnouncements(req: Request, res: Response): Promise<void> {
        const announcements: IAnnouncement[] = await AnnouncementService.getAllAnnouncements();

        res.status(200).send(announcements);
    }

    public static async getRescuedAnnouncements(req: Request, res: Response): Promise<void> {
        const announcements: IAnnouncement[] = await AnnouncementService.getRescuedAnnouncements();

        res.status(200).send(announcements);
    }

    public static async getAnnouncement(req: Request, res: Response): Promise<void> {
        const announcementId = req.params.id;

        const announcement: IAnnouncement = await AnnouncementService.getAnnouncement(announcementId);

        res.status(200).send(announcement);
    }

    public static async getSubscribedAnnouncements(req: Request, res: Response): Promise<void> {
        const id = (await OrganisationService.getOrganisationByToken(req.headers.authorization)).id;

        const announcements: IAnnouncement[] = await AnnouncementService.getSubscribedAnnouncements(id);

        res.status(200).send(announcements);
    }

    public static async deleteAnnouncement(req: Request, res: Response): Promise<void> {
        const announcementId = req.params.id;

        await AnnouncementService.deleteAnnouncement(announcementId);

        res.status(200).send();
    }

    public static async updateAnnouncement(req: Request, res: Response): Promise<void> {
        const announcementId = req.params.id;
        const model = req.body;

        await AnnouncementService.updateAnnouncement(model, announcementId);

        res.status(200).send();
    }

    public static async addAnnouncement(req: Request, res: Response): Promise<void> {
        const model: IAnnouncement = req.body;
        const ownerId = (await UserService.getUserByToken(req.headers.authorization)).id;

        model.status = Status.Open;
        model.ownerId = ownerId;

        const announcement = await AnnouncementService.addAnnouncement(model);

        res.status(200).send(announcement);
    }

    public static async approveAnnouncement(req: Request, res: Response): Promise<void> {
        const announcementId: number = req.params.id;

        await AnnouncementService.changeStatus(announcementId, Status.Open);

        res.status(200).send();
    }

    public static async changeAnnouncementStatus(req: Request, res: Response) {
        const announcementId: number = req.params.id;
        const status: number = req.body.status;

        await AnnouncementService.changeStatus(announcementId, status);

        res.status(200).send();
    }
}
