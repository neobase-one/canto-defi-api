import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { TransactionDb, TransactionModel } from '../../../models/dex/transaction';

@Service()
export class TransactionService {
  async getOrCreate(hash: string) {
    let doc = await TransactionModel.findOne({id: hash}).exec();
    if (doc === null) {
      let transaction = new TransactionDb(hash);
      doc = new TransactionModel(transaction);
    }
    return doc;
  }

  async getByHash(hash: string) {
    return await TransactionModel.findOne({id: hash}).exec();
  }
}