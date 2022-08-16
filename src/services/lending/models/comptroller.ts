import { Service } from 'typedi';
import { ComptrollerModel } from '../../../models/lending/comptroller';

@Service()
export class ComptrollerService {
    async getById(id: string) {
        return await ComptrollerModel.findOne({ id: id }).exec();
    }
}