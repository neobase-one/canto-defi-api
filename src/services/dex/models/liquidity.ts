import { Service } from 'typedi';
import { LiquidityPositionDb, LiquidityPositionModel } from '../../../models/dex/liquidityPosition';
import { LiquidityPositionSnapshot, LiquidityPositionSnapshotModel } from '../../../models/dex/liquidityPositionSnapshot';

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
}