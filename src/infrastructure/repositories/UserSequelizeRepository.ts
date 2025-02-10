import { UserRepositoryContract } from "../../domain/contracts/UserRepositoryContract";
import { User } from "../../domain/entities/User";
import { Uuid } from './../../domain/value-objects/Uuid';

const UserModel = require("../../../models").user;

export class UserSequelizeRepository implements UserRepositoryContract {
  async create(user: User): Promise<User> {
    const newUser = await UserModel.create({
      id: user.getId().getValue(),
      ip: user.getIp(),
      email: user.getEmail(),
    });
    return new User(
      new Uuid(newUser.id),
      newUser.ip,
      newUser.email
    );
  }

  async exists(userId: Uuid): Promise<boolean> {
    const user = await UserModel.findByPk(userId.getValue());
    return !!user;
  }

}
