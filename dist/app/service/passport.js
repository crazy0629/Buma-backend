"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("../config");
const auth_model_1 = require("../models/auth.model");
/**
 * StrategyOptions interface
 * Using passport-jwt
 */
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.SECRET_KEY,
};
/**
 * Instance Strategy Class
 */
exports.default = new passport_jwt_1.Strategy(opts, (payload, done) => {
    console.log(payload);
    try {
        auth_model_1.User.findByPk(payload.id)
            .then((data) => {
            return done(null, data === null || data === void 0 ? void 0 : data.toJSON());
        })
            .catch((err) => {
            console.log(err);
        });
        return done(null, false);
    }
    catch (error) {
        console.log(error);
    }
});
