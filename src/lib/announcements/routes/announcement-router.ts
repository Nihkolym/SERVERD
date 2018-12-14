import { Router } from "express";
import AnnouncementController from "../controllers/announcement-controller";
import CheckRoleMiddleware from "../../server/check-role.middleware";
import { Role } from "../../server/models/role";
import * as multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/photos");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("photo");

class AnnouncementRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get("/", AnnouncementController.getAllAnnouncements);
        this.router.get("/subscribed", AnnouncementController.getSubscribedAnnouncements);
        this.router.get("/rescued",
            AnnouncementController.getRescuedAnnouncements,
        );
        this.router.get("/:id", AnnouncementController.getAnnouncement);
        this.router.post("/",
            CheckRoleMiddleware.checkRole(Role.Admin, Role.User),
            (req, res, next) => {
                upload(req, res, (err) => {
                    req.body.photo = req.file.filename;

                    next();
                });
            },
            AnnouncementController.addAnnouncement,
        );
        this.router.delete("/:id",
            CheckRoleMiddleware.checkRole(Role.Admin, Role.User),
            AnnouncementController.deleteAnnouncement,
        );
        this.router.put("/:id/approve",
            CheckRoleMiddleware.checkRole(Role.Admin),
            AnnouncementController.approveAnnouncement,
        );
        this.router.put("/:id/changeStatus",
            CheckRoleMiddleware.checkRole(Role.Organisation),
            AnnouncementController.changeAnnouncementStatus,
        );
        this.router.put("/:id",
            CheckRoleMiddleware.checkRole(Role.Admin, Role.User),
            AnnouncementController.updateAnnouncement,
        );
    }
}

const announcementRouter = new AnnouncementRouter();

export default announcementRouter.router;
