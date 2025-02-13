import { User } from "../entities/User";
import { Uuid } from "../value-objects/Uuid";

export interface UserRepositoryContract {
  create(user: User): Promise<User>;
  exists(userId: Uuid): Promise<boolean>;
}