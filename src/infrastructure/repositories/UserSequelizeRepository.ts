import { UserRepositoryContract } from "../../domain/contracts/UserRepositoryContract";
import { User } from "../../domain/entities/User";

const UserModel = require("../../../models").User;

export class UserSequelizeRepository implements UserRepositoryContract {
  async create(user: User): Promise<User> {
    const newUser = await UserModel.create({
      id: user.getId().getValue(),
      ip: user.getIp(),
      email: user.getEmail(),
    });
    return new User(
      newUser.id,
      newUser.ip,
      newUser.email
    );
  }
}
