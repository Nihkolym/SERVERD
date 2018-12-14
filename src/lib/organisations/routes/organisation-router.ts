import { Router } from "express";
import OrganisationController from "../controllers/organisation-controller";
import { AuthController } from "../../authentication/controllers/auth-controller";
import CheckRoleMiddleware from "../../server/check-role.middleware";
import { Role } from "../../server/models/role";
import * as multer from "multer";
import { pathToFileURL } from "url";
import * as path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });

const upload = multer({ storage });

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get("/", OrganisationController.getAllOrganisations);
        this.router.get("/waiting", OrganisationController.getWaitingOrganisation);
        this.router.get("/:id", OrganisationController.getOrganisation);
        this.router.post("/signup", upload.single("certificate"), AuthController.signOrganisationUp);
        this.router.post("/login", AuthController.signOrganisationIn);
        this.router.post("/:id/subscribe",
            CheckRoleMiddleware.checkRole(Role.Organisation),
            OrganisationController.subscribeOnAnnouncement,
        );
        this.router.delete("/:id",
            CheckRoleMiddleware.checkRole(Role.Admin),
            OrganisationController.deleteOrganisation,
        );
        this.router.put("/:id",
            CheckRoleMiddleware.checkRole(Role.Admin, Role.Organisation),
            OrganisationController.updateOrganisation,
        );
    }
}

const userRouter = new UserRouter();

export default userRouter.router;
