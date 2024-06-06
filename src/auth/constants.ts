import { getEnv } from "src/app.environment";

export const jwtConstants = {
    secret: getEnv("JWT_SECRET"),
};
