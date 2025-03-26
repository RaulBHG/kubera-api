import { CategoryRepositoryContract } from "../../domain/contracts/CategoryRepositoryContract";
import { Category } from "../../domain/entities/Category";
import { Uuid } from "../../domain/value-objects/Uuid";

const CategoryModel = require("../../../models").category;

export class CategorySequelizeRepository implements CategoryRepositoryContract {
  async getAll(): Promise<Category[]> {
    const categories = await CategoryModel.findAll();
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

  async getById(id: string): Promise<Category | null> {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      return null;
    }

    return new Category(
      category.id,
      category.slug,
      category.name,
      category.external_id,
      category.visible
    );
  }

  async getByIds(ids: string[]): Promise<Category[]> {
    const categories = await CategoryModel.findAll({
      where: {
        id: ids,
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

  async getAllVisible(): Promise<Category[]> {
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

  async updateOrCreateByExternalId(
    categories: Category[]
  ): Promise<Category[]> {
    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        await CategoryModel.update(
          {
            slug: category.slug,
            name: category.name,
            visible: category.visible,
          },
          {
            where: {
              external_id: category.externalId,
            },
          }
        );

        const updatedCategory = await CategoryModel.findOne({
          where: {
            external_id: category.externalId,
          },
        });

        if (!updatedCategory) {
          return await CategoryModel.create({
            id: Uuid.create().getValue(),
            slug: category.slug,
            name: category.name,
            visible: category.visible,
            external_id: category.externalId,
          });
        }

        return updatedCategory;
      })
    );

    return updatedCategories.map(
      (category) =>
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
