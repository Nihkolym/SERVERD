import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { Strategy as localStrategy } from "passport-local";
import { User } from "../../users/models/user";
import { UserService } from "../../users/services/user-service";
import { Strategy as JWTstrategy, ExtractJwt as ExtractJWT } from "passport-jwt";
import { Role } from "../../server/models/role";
import { Request } from "express";
import { OrganisationService } from "../../organisations/services/organisation-service";
import { State } from "../../organisations/models/state";
import { Organisation } from "../../organisations/models/Organisation";

export default class AuthService {
    public static setUpPassport(): void {
        AuthService.setSignUp();
        AuthService.setLogIn();
        AuthService.setCheckAccess();
    }

    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public static async isValidPassword(userPass: string, password: string): Promise<boolean> {
        return bcrypt.compare(password, userPass);
    }

    private static async setSignUp(): Promise<void> {
        passport.use("usersignup", new localStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        }, this.userSignUp));

        passport.use("organisationsignup", new localStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        }, this.organisationSignUp));
    }

    private static async setLogIn(): Promise<void> {
        passport.use("userlogin", new localStrategy({
            usernameField: "email",
            passwordField: "password",
        }, this.userLogIn));

        passport.use("organisationlogin", new localStrategy({
            usernameField: "email",
            passwordField: "password",
        }, this.organisationLogIn));
    }

    private static async setCheckAccess(): Promise<void> {
        passport.use(new JWTstrategy({
            secretOrKey: "top_secret",
            jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("jwt"),
        }, async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }));
    }

    private static async userSignUp(req: Request, email: string, password: string, done: any) {
        try {
            const hashPass = await AuthService.hashPassword(password);
            await UserService.addUser({
                email,
                password: hashPass,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: Role.User,
            });

            return done(null);
        } catch (error) {
            return done(error);
        }
    }

    private static async organisationSignUp(req: Request, email: string, password: string, done: any) {
        try {
            const hashPass = await AuthService.hashPassword(password);
            await OrganisationService.addOrganisation({
                email,
                password: hashPass,
                active: State.UnActive,
                name: req.body.name,
                certificate: req.body.certificate,
                phone: req.body.phone,
                role: Role.Organisation,
            });

            return done(null);
        } catch (error) {
            return done(error);
        }
    }

    private static async userLogIn(email, password, done) {
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            const validate = await AuthService.isValidPassword(user.password, password);

            if (!validate) {
                return done(null, false, { message: "Wrong Password" });
            }

            return done(null, user, { message: "Logged in Successfully" });
        } catch (error) {
            return done(error);
        }
    }

    private static async organisationLogIn(email, password, done) {
        try {
            const organisation = await Organisation.findOne({ where: { email } });

            if (organisation.active === State.UnActive) {
                return done(null, false, { message: "Organisation is being on review" });
            }

            if (!organisation) {
                return done(null, false, { message: "Organisation not found" });
            }

            const validate = await AuthService.isValidPassword(organisation.password, password);

            if (!validate) {
                return done(null, false, { message: "Wrong Password" });
            }

            return done(null, organisation, { message: "Logged in Successfully" });
        } catch (error) {
            return done(error);
        }
    }
}
