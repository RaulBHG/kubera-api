import { CategoryRepositoryContract } from "../../domain/contracts/CategoryRepositoryContract";
import { Category } from "../../domain/entities/Category";

const CategoryModel = require("../../../models").category;

export class CategorySequelizeRepository implements CategoryRepositoryContract {
  async getAll(): Promise<Category[]> {
    const categories = await CategoryModel.findAll({
      where: {
        visible: true,
      },
    });
    return categories.map(
      (category: typeof CategoryModel) =>
        new Category(
          category.id,
          category.slug,
          category.name,
          category.external_id,
          category.visible
        )
    );
  }
}
