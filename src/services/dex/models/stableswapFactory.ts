import { Service } from "typedi";
import { StableswapFactoryDb, StableswapFactoryModel } from "../../../models/dex/stableswapFactory";

@Service()
export class StableswapFactoryService {
  async getByAddress(address: string) {
    return await StableswapFactoryModel.findOne({ address: address }).exec();
  }

  async save(obj: StableswapFactoryDb) {
    let model = new StableswapFactoryModel(obj);
    model.isNew = false;
    await model.save();
  }
}