import { Category } from "../../entities/Category";

export interface CategoryRepositoryContract {
  getAll(): Promise<Category[]>;
  getAllVisible(): Promise<Category[]>;
  save(category: Category): Promise<Category>;
  updateOrCreateByExternalId(categories: Category[]): Promise<Category[]>;
}
