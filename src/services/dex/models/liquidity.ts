import { Service } from 'typedi';
import { LiquidityPositionDb, LiquidityPositionModel } from '../../../models/dex/liquidityPosition';
import { LiquidityPositionSnapshot, LiquidityPositionSnapshotDb, LiquidityPositionSnapshotModel } from '../../../models/dex/liquidityPositionSnapshot';

@Service()
export class LiquidityPositionService {
  async getOrCreate(id: string) {
    let doc = await LiquidityPositionModel.findOne({ id: id }).exec();
    if (doc === null) {
      let liquidityPosition = new LiquidityPositionDb(id);
      doc = new LiquidityPositionModel(liquidityPosition);
    }
    return doc;
  }

  async getById(id: string) {
    return await LiquidityPositionModel.findOne({ id: id }).exec();
  }

  async save(data: LiquidityPositionDb) {
    let model = new LiquidityPositionModel(data);
    model.isNew = false;
    await model.save();
  }
}


@Service()
export class LiquidityPositionSnapshotService {
  async getOrCreate(id: string) {
    let doc = await LiquidityPositionSnapshotModel.findOne({ id: id }).exec();
    if (doc === null) {
      let liquidityPositionSnapshot = new LiquidityPositionSnapshot();
      liquidityPositionSnapshot.justId(id);
      doc = new LiquidityPositionSnapshotModel(liquidityPositionSnapshot);
    }
    return doc;
  }

  async getById(id: string) {
    return await LiquidityPositionSnapshotModel.findOne({ id: id }).exec();
  }

  async save(data: LiquidityPositionSnapshotDb) {
    let model = new LiquidityPositionSnapshotModel(data);
    model.isNew = false;
    await model.save();
  }
}