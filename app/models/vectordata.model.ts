import { DataTypes } from "sequelize";
import { db } from ".";

export const VectorData = db.sequelize.define("vector", {
  articleId: {
    type: DataTypes.INTEGER,
  },
  text: {
    type: DataTypes.TEXT,
  },
  data: {
    type: DataTypes.JSON,
  },
});
