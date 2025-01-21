'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mistery_box extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mistery_box.init(
    {
      user_id: DataTypes.STRING,
      type_id: DataTypes.STRING,
      expiration: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "mistery_box",
      underscored: true,
    }
  );
  return mistery_box;
};