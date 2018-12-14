import { Role } from "./models/role";
import { Response, Request, NextFunction } from "express";
import { IUser } from "../users/models/user";
import { UserService } from "../users/services/user-service";
import { OrganisationService } from "../organisations/services/organisation-service";

export default class CheckRoleMiddleware {
    public static checkRole(...roles: Role[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const token: string = req.headers.authorization!;
            let entity: any;

            try {
                entity = await UserService.getUserByToken(token);
            } catch (error) {
                entity  = await OrganisationService.getOrganisationByToken(token);
            }

            const isValid = roles.some((role) => entity.role === role);

            if (isValid) {
                next();
            } else {
                throw Error("400");
            }
        };
    }
}
