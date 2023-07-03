import { DataTypes } from "sequelize";
import { db } from ".";

export const User = db.sequelize.define("user", {
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  apiKey: {
    type: DataTypes.STRING,
  },
});
