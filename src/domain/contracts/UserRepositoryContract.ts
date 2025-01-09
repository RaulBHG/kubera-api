import { User } from "../entities/User";

export interface UserRepositoryContract {
  create(user: User): Promise<User>;
}