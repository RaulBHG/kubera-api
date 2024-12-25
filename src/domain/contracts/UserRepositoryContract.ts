import { User } from "../entities/User";

export interface UserRepositoryContract {
  create(): Promise<User>;
}