
import { Container, Service } from 'typedi';
import { Token } from '../../../models/token';

@Service()
export class TokenService {
  getOrCreate(address: string): Token {
    return new Token();
  }
}