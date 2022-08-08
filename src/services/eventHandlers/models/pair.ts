import { Service } from "typedi";
import { Pair, PairModel } from "../../../models/pair";

@Service()
export class PairService {
  async getOrCreate(address: string) {
    let doc = await PairModel.findOne({ id: address }).exec();
    if (doc === null) {
      let obj = new Pair();
      obj.justId(address);
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
