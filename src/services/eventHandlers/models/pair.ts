
import { Container, Service } from 'typedi';
import { Pair } from '../../../models/pair';

@Service()
export class PairService {
  getOrCreate(address: string): Pair {
    return new Pair();
  }
}