import { Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { web3 } from "../../loaders/web3";
import { IndexDb, IndexModel } from "../../models";

@Resolver()
export class HealthResolver {
  @Query((returns) => Health)
  async health() {
    // chain head
    const chainHeadBlockNumber = await web3.eth.getBlockNumber();
    const chainBlock = await web3.eth.getBlock(chainHeadBlockNumber);
    const chainHeadTimestamp = parseInt(chainBlock.timestamp.toString());

    // latest indexed block
    let indexDb: any = await IndexModel.find({})
      .sort({ lastBlockNumber: "desc" })
      .limit(1).exec();
    indexDb = indexDb[0];
    const latestIndexedBlockNumber = indexDb.lastBlockNumber;
    const latestBlock = await web3.eth.getBlock(latestIndexedBlockNumber);
    const latestIndexedBlockTimestamp = parseInt(latestBlock.timestamp.toString());

    // sync
    var synced = false;
    if (chainHeadBlockNumber == latestIndexedBlockNumber) {
      synced = true;
    }
    // index
    const health = new Health();
    health.synced = synced;
    health.chainHeadBlockNumber = chainHeadBlockNumber;
    health.chainHeadTimestamp = chainHeadTimestamp;
    health.latestIndexedBlockNumber = latestIndexedBlockNumber;
    health.latestIndexedBlockTimestamp = latestIndexedBlockTimestamp;

    return health;
  }
}


@ObjectType()
export class Health {
  @Field((type) => Boolean, {nullable: true})
  synced: boolean

  @Field((type) => Int, {nullable: true})
  chainHeadBlockNumber: number

  @Field((type) => Int, {nullable: true})
  chainHeadTimestamp: number

  @Field((type) => Int, {nullable: true})
  latestIndexedBlockNumber: number

  @Field((type) => Int, {nullable: true})
  latestIndexedBlockTimestamp: number
}
