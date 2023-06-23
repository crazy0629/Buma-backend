"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PINECONE_TEXT_KEY = exports.SECRET_KEY = exports.DB_POOL = exports.DB_DIALECT = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = void 0;
exports.DB_HOST = "localhost";
exports.DB_USER = "postgres";
exports.DB_PASSWORD = "20010629crazy";
exports.DB_NAME = "Buma";
exports.DB_DIALECT = "postgres";
exports.DB_POOL = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
};
exports.SECRET_KEY = "Buma_Backend_Project_By_Milan";
exports.PINECONE_TEXT_KEY = "markdown";
