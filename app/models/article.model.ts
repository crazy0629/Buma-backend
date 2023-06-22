import { DataTypes } from "sequelize";
import { db } from ".";

export const Article = db.sequelize.define("article", {
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  plainText: {
    type: DataTypes.TEXT,
  },
  embeded: {
    type: DataTypes.BOOLEAN,
  },
  date: {
    type: DataTypes.DATE,
  },
  author: {
    type: DataTypes.INTEGER,
  },
});
