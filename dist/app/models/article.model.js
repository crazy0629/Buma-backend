"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const sequelize_1 = require("sequelize");
const _1 = require(".");
exports.Article = _1.db.sequelize.define("article", {
    title: {
        type: sequelize_1.DataTypes.STRING,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
    },
    embeded: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
    },
    author: {
        type: sequelize_1.DataTypes.INTEGER,
    },
});
