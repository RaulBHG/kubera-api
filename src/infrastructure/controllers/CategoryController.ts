import { GetCategoryUseCase } from "../../application/GetCategoryUseCase";
import { Category } from "../../domain/entities/Category";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";
import { Response } from "express";
import { Controller } from "./Controller";

export class CategoryController extends Controller {
  async getAll(res: Response): Promise<void> {
    try {
      const useCase = new GetCategoryUseCase(new CategorySequelizeRepository());
      const categories = await useCase.getVisible();
      const formatedCategories = categories.map((category: Category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
      }));

      res.status(200).json({
        success: true,
        data: formatedCategories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching categories",
      });
    }
  }
}
