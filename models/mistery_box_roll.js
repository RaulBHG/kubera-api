'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mistery_box_roll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mistery_box_roll.init(
    {
      viewed: DataTypes.BOOLEAN,
      rejected: DataTypes.BOOLEAN,
      selected: DataTypes.BOOLEAN,
      item_number: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "mistery_box_roll",
      underscored: true,
    }
  );
  return mistery_box_roll;
};