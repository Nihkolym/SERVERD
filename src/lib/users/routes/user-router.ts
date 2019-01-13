import { Router } from "express";
import UserController from "../controllers/user-controller";
import { AuthController } from "../../authentication/controllers/auth-controller";
import CheckRoleMiddleware from "../../server/check-role.middleware";
import { Role } from "../../server/models/role";
import * as multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("avatar");

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get("/",
            CheckRoleMiddleware.checkRole(Role.Admin),
            UserController.getAllUsers,
        );
        this.router.get("/getUserByToken", UserController.getUser);
        this.router.post("/signup", AuthController.signUserUp);
        this.router.post("/login", AuthController.signUserIn);
        this.router.put("/changeOrganisationState",
            CheckRoleMiddleware.checkRole(Role.Admin),
            UserController.changeOrganisationState,
        );
        this.router.delete("/:id", UserController.deleteUser);
        this.router.put("/:id",
            CheckRoleMiddleware.checkRole(Role.User, Role.Admin),
            (req, res, next) => {
                upload(req, res, (err) => {

                    if (req.file) {
                        req.body.avatar = req.file.filename;
                    }

                    next();
                });
            },
            UserController.updateUser,
        );
    }
}

const userRouter = new UserRouter();

export default userRouter.router;
