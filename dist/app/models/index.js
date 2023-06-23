"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const sequelize = new sequelize_1.Sequelize(config_1.DB_NAME, config_1.DB_USER, config_1.DB_PASSWORD, {
    host: config_1.DB_HOST,
    dialect: config_1.DB_DIALECT,
    pool: config_1.DB_POOL,
});
exports.db = { Sequelize: sequelize_1.Sequelize, sequelize };
