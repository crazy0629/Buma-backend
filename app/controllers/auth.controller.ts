import { Request, Response } from "express";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

import { User } from "../models/auth.model";
import { generatePswHash, generateToken } from "../service/helpers";
import { IUser } from "../service/interface";

export const signUp = async (req: Request, res: Response) => {
  const hashPassword = await generatePswHash(req.body.password);

  const query = {
    where: {
      email: {
        [Op.eq]: req.body.email,
      },
    },
  };

  User.findOne(query)
    .then((user) => {
      if (user == null) {
        const newUser = {
          email: req.body.email,
          password: hashPassword,
        };
        User.create(newUser)
          .then((data) => {
            res.json({ success: true, message: "Successfully registered" });
          })
          .catch((err) => {
            res.json({ success: false, message: "Database Connection Error" });
          });
      } else {
        res.json({ success: false, message: "User already exists" });
      }
    })
    .catch((error) => {
      res.json({ success: false, message: "Database Connection Error" });
    });
};

export const signIn = (req: Request, res: Response) => {
  const query = {
    where: {
      email: {
        [Op.eq]: req.body.email,
      },
    },
  };

  User.findOne(query)
    .then((user) => {
      if (user == null) {
        res.json({ success: false, message: "User does not exist" });
      } else {
        bcrypt
          .compare(req.body.password, user.toJSON().password)
          .then((result) => {
            if (result) {
              return res.json({
                success: true,
                token: generateToken(user.toJSON()),
              });
            } else {
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
