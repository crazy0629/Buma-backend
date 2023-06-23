"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_model_1 = require("../models/auth.model");
const helpers_1 = require("../service/helpers");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPassword = yield (0, helpers_1.generatePswHash)(req.body.password);
    const query = {
        where: {
            email: {
                [sequelize_1.Op.eq]: req.body.email,
            },
        },
    };
    auth_model_1.User.findOne(query)
        .then((user) => {
        if (user == null) {
            const newUser = {
                email: req.body.email,
                password: hashPassword,
            };
            auth_model_1.User.create(newUser)
                .then((data) => {
                res.json({ success: true, message: "Successfully registered" });
            })
                .catch((err) => {
                res.json({ success: false, message: "Database Connection Error" });
            });
        }
        else {
            res.json({ success: false, message: "User already exists" });
        }
    })
        .catch((error) => {
        res.json({ success: false, message: "Database Connection Error" });
    });
});
exports.signUp = signUp;
const signIn = (req, res) => {
    const query = {
        where: {
            email: {
                [sequelize_1.Op.eq]: req.body.email,
            },
        },
    };
    auth_model_1.User.findOne(query)
        .then((user) => {
        if (user == null) {
            res.json({ success: false, message: "User does not exist" });
        }
        else {
            bcrypt_1.default
                .compare(req.body.password, user.toJSON().password)
                .then((result) => {
                if (result) {
                    return res.json({
                        success: true,
                        token: (0, helpers_1.generateToken)(user.toJSON()),
                    });
                }
                else {
                    res.json({ success: false, message: "Password is not correct" });
                }
            })
                .catch((err) => {
                res.json({
                    success: false,
                    message: "System Error while checking password",
                });
            });
        }
    })
        .catch((error) => {
        res.json({ success: false, message: "Database Connection Error" });
    });
};
exports.signIn = signIn;
