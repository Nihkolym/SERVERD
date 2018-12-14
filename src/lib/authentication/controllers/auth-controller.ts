import * as passport from "passport";
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../../users/models/user";
import { IOrganisation } from "../../organisations/models/Organisation";

export class AuthController {
    public static async signUserUp(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate("usersignup", (err: Error, user: IUser) => {
            if (err) {
                res.sendStatus(400);
            } else {
                res.status(200).send(user);
            }
        })(req, res, next);
    }

    public static async signOrganisationUp(req: Request, res: Response, next: NextFunction) {
        req.body.certificate = req.file.filename;
        return passport.authenticate("organisationsignup", (err: Error, organisation: IOrganisation) => {
            if (err) {
                res.sendStatus(400);
            } else {
                res.status(200).send(organisation);
            }
        })(req, res, next);
    }

    public static async signUserIn(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate("userlogin", async (err: Error, user: IUser) => {
            try {
                if (err || !user) {
                    throw new Error("500");
                }
                req.login(user, { session: false }, async (error) => {
                    if (error) {
                        return next(error);
                    }

                    const body = { email: user.email };

                    const token = jwt.sign(body, process.env.SECRET!, {
                        expiresIn: "30 days",
                    });

                    return res.json({ token, role: user.role });
                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    }

    public static async signOrganisationIn(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate("organisationlogin", async (err: Error, organisation: IOrganisation) => {
            try {
                if (err || !organisation) {
                    throw new Error("500");
                }
                req.login(organisation, { session: false }, async (error) => {
                    if (error) {
                        return next(error);
                    }

                    const body = { email: organisation.email };

                    const token = jwt.sign(body, process.env.SECRET!, {
                        expiresIn: "30 days",
                    });

                    return res.json({ token, role: organisation.role });
                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    }
}
