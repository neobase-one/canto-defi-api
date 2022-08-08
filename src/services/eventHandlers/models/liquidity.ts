import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { LiquidityPosition, LiquidityPositionModel } from '../../../models/liquidityPosition';
import { LiquidityPositionSnapshot, LiquidityPositionSnapshotModel } from '../../../models/liquidityPositionSnapshot';
import { StableswapDayData, StableswapDayDataModel } from '../../../models/stableswapDayData';

@Service()
export class LiquidityPositionService {
  async getOrCreate(id: string) {
    let doc = await LiquidityPositionModel.findOne({id: id}).exec();
    if (doc === null) {
      let liquidityPosition = new LiquidityPosition(id);
      doc = new LiquidityPositionModel(liquidityPosition);
    }
    return doc;
  }

  async getById(id: string) {
    return await LiquidityPositionModel.findOne({id: id}).exec();
  }
}


@Service()
export class LiquidityPositionSnapshotService {
  async getOrCreate(id: string) {
    let doc = await LiquidityPositionSnapshotModel.findOne({id: id}).exec();
    if (doc === null) {
      let liquidityPositionSnapshot = new LiquidityPositionSnapshot(id);
      doc = new LiquidityPositionSnapshotModel(liquidityPositionSnapshot);
    }
    return doc;
  }

  async getById(id: string) {
    return await LiquidityPositionSnapshotModel.findOne({id: id}).exec();
  }
}