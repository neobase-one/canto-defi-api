import { Service } from "typedi";
import { PairDb, PairModel } from "../../../models/dex/pair";

@Service()
export class PairService {
  async getOrCreate(address: string) {
    let doc = await PairModel.findOne({ id: address }).exec();
    if (doc === null) {
      let obj = new PairDb(address);
      doc = new PairModel(obj);
    }
    return doc;
  }

  async getPair(token0: string, token1: string) {
    let doc = await PairModel.findOne({
      $or: [
        { token0: token0, token1: token1 },
        { token0: token1, token1: token0 },
      ],
    }).exec();
    return doc;
  }

  async getByAddress(address: string) {
    return await PairModel.findOne({ id: address }).exec();
  }
}
