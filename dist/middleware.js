import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
export const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decode = jwt.verify(header, JWT_PASSWORD);
    if (decode) {
        //@ts-ignore
        req.userId = decode.id;
        next();
    }
    else {
        return res.status(403).json({
            messsage: "You're not logged in",
        });
    }
};
//overide the types of express request object
//# sourceMappingURL=middleware.js.map