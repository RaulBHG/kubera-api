import { MysteryBoxTypeRepositoryContract } from "../../domain/contracts/MysteryBoxTypeRepositoryContract";
import { MysteryBoxType } from "../../domain/entities/MysteryBoxType";
import { Uuid } from './../../domain/value-objects/Uuid';

const TypeModel = require("../../../models").mystery_box_type;
const PiggyModel = require("../../../models").piggy_bank;

export class MisteryBoxTypeSequelizeRepository
  implements MysteryBoxTypeRepositoryContract
{
  async getTypeForAmount(euroAmount: number): Promise<MysteryBoxType> {
    const types = TypeModel.findAll({
      order: [["percentage", "ASC"]],
    });
    const standarType = TypeModel.findOne((type: any) => type.multiplier === 0);
    if (!standarType) {
      throw new Error("No standard type found");
    }
    // TODO: Hay que retener ese dinero para tenerlo bloqueado para el usuario que esté realizando la transacción
    if (!this.canPiggyBankAssumeAmount(euroAmount)) return standarType;

    const selectedType = types.find(
      (type: any) => Math.random() <= type.percentage / 100
    );

    const finalType = selectedType || standarType;

    return new MysteryBoxType(
      new Uuid(finalType.id),
      finalType.slug,
      finalType.name,
      finalType.percentage,
      finalType.multiplier
    );
  }

  private canPiggyBankAssumeAmount(amount: number): boolean {
    const piggyFound = PiggyModel.findOne();
    if (!piggyFound) return false;

    return piggyFound.amount >= amount * 2;
  }
  
}
