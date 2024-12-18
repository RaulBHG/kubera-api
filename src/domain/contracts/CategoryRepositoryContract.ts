import { Category } from "../entities/Category";

export interface CategoryRepositoryContract {

  getAll(): Promise<Category[]>;

}