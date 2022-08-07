import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { Mint, MintModel } from '../../../models/mint';

@Service()
export class MintService {
  async getOrCreate(id: string) {
    let doc = await MintModel.findOne({id: id}).exec();
    if (doc === null) {
      let mint = new Mint(id);
      doc = new MintModel(mint);
    }
    return doc;
  }

  async getById(id: string) {
    return await MintModel.findOne({id: id}).exec();
  }

  async deleteById(id: string) {
    return await MintModel.findOneAndDelete({id: id}).exec();
  }
}