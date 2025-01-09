"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class platform extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  platform.init(
    {
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      external_id: DataTypes.STRING,
      visible: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "platform",
      underscored: true,
    }
  );
  return platform;
};
