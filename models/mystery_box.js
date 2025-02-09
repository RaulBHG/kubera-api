'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mystery_box extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      mystery_box.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
      });
      mystery_box.belongsTo(models.mystery_box_type, {
        foreignKey: "type_id",
        as: "type",
      });
      mystery_box.hasMany(models.mystery_box_roll, {
        foreignKey: "mystery_box_id",
        as: "rolls",
      });
      mystery_box.belongsToMany(models.category, {
        through: "mystery_boxes_categories", // specify the join table
        foreignKey: "mystery_box_id",
        otherKey: "category_id",
        as: "categories",
      });
      mystery_box.belongsToMany(models.platform, {
        through: "mystery_boxes_platforms", // specify the join table
        foreignKey: "mystery_box_id",
        otherKey: "platform_id",
        as: "platforms",
      });
    }
  }
  mystery_box.init(
    {
      user_id: DataTypes.STRING,
      type_id: DataTypes.STRING,
      expiration: DataTypes.DATE,
      region: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "mystery_box",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return mystery_box;
};