import { User } from "./../../users/models/User";
import { IAnnouncement, Announcement } from "../models/Announcement";
import { Status } from "../models/status";
import { Op } from "sequelize";

export class AnnouncementService {
    public static async getAllAnnouncements(): Promise<IAnnouncement[]> {
        return await Announcement.findAll({
            where: {
                status: {
                    [Op.in]: [1, 2],
                },
            },
            include: [
                {
                    model: User,
                },
            ],
        });
    }

    public static async getSubscribedAnnouncements(id): Promise<IAnnouncement[]> {
        return await Announcement.findAll({
            where: {
                organizationId: id,
            },
            include: [
                {
                    model: User,
                },
            ],
        });
    }

    public static async subscribeOrganisation(announcementId: number, organisationId: number) {
        return await Announcement.update(
            { organizationId: organisationId, status: Status.InProgress },
            { where: { id: announcementId } },
        );
    }

    public static async getAnnouncement(announcementId: number): Promise<IAnnouncement> {
        const announcement = await Announcement.findByPk(announcementId);

        if (announcement) {
            return announcement;
        } else {
            throw Error("500");
        }
    }

    public static async getRescuedAnnouncements(): Promise<IAnnouncement[]> {
        const announcements = await Announcement.findAll({
            where: {
                status: Status.OnRescue,
            },
            include: [
                {
                    model: User,
                },
            ],
        });

        return announcements;

    }

    public static async addAnnouncement(model: IAnnouncement): Promise<IAnnouncement> {
        const announcement = await Announcement.create(model);

        if (announcement) {
            return announcement;
        } else {
            throw new Error("500");
        }
    }

    public static async deleteAnnouncement(announcementId: number): Promise<void> {
        const res = await Announcement.destroy(
            {
                where: {
                    id: announcementId,
                },
            },
        );

        if (!res) {
            throw new Error("500");
        }
    }

    public static async updateAnnouncement(model: IAnnouncement, announcementId: number): Promise<void> {
        await Announcement.update(model,
            {
                where: {
                    id: announcementId,
                },
            },
        );
    }

    public static async changeStatus(announcementId: number, status: number): Promise<void> {
        await Announcement.update({ status },
            {
                where: {
                    id: announcementId,
                },
            },
        );
    }
}
