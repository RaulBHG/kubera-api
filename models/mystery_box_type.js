'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mystery_box_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mystery_box_type.init(
    {
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      percentage: DataTypes.FLOAT,
      multiplier: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "mystery_box_type",
      underscored: true,
    }
  );
  return mystery_box_type;
};