import { Service } from "typedi";
import { PairDb, PairModel } from "../../../models/dex/pair";

@Service()
export class PairService {
  async getOrCreate(address: string) {
    let doc = await PairModel.findOne({ id: address }).exec();
    if (doc === null) {
      let obj = new PairDb(address);
      doc = new PairModel(obj);
      await doc.save();
    }
    return doc as PairDb;
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

  async save(data: PairDb) {
    let model = new PairModel(data);
    model.isNew = false;
    await model.save();
  }
}
