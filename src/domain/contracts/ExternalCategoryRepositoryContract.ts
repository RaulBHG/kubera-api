import { Category } from "../../entities/Category";

export interface ExternalCategoryRepositoryContract {
  getAll(): Promise<Category[]>;
}
