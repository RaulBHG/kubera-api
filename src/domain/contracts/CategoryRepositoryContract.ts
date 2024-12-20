import { Category } from "../entities/Category";

export interface CategoryRepositoryContract {
  getAll(): Promise<Category[]>;
  getAllVisible(): Promise<Category[]>;
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(category: Category): Promise<void>;
}
