import { Service } from 'typedi';
import { BundleDb, BundleModel } from '../../../models/dex/bundle';

@Service()
export class BundleService {

  async get() {
    return await BundleModel.findOne({ id: 1 }).exec();
  }

  async save(bundle: BundleDb) {
    let model = new BundleModel(bundle);
    model.isNew = false;
    await model.save();
  }
}