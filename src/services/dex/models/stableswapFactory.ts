import { Service } from "typedi";
import { Config } from "../../../config";
import { StableswapFactory, StableswapFactoryModel } from "../../../models/dex/stableswapFactory";

@Service()
export class StableswapFactoryService {
  async getByAddress(address: string) {
    return await StableswapFactoryModel.findOne({address: address}).exec();
  }
}