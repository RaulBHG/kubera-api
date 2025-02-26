import { Category } from "../entities/Category";

export interface CategoryRepositoryContract {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  getAllVisible(): Promise<Category[]>;
  updateOrCreateByExternalId(categories: Category[]): Promise<Category[]>;
}
