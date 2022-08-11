
## Canto DeFi API

  
### 0. Pre-Requisites
1. A running MongoDB instance

### 1. Local Dev
#### 1.1 Env Setup
1. Install `nvm`
	```sh
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
	```

2. Setup up environment
	```sh
	nvm install 16.0
	nvm use 16.0
	yarn install
	```



#### 1.1 Run Indexer
1. Update `.env` placed in root of project
	```
	MONGODB_URI="mongodb+srv://..."
	LOG_LEVEL="debug"
	WEBSOCKET_URL="ws://3.111.45.9:8546"
	MAX_BLOCK_RANGE=500 # size of window for querying blocks
	INDEX=TRUE
	# pick block number lower than the block number at which
    # either swap or lending are deployed
	START_BLOCK=220000 # default 0
	```
2. Run server
	```sh
	yarn run redo
	```

#### 1.2 Run GraphQL Server
1. Update `.env` placed in root of project
	```
	MONGODB_URI="mongodb+srv://..." # connect to same db as indexer
	PORT=4000
	```
2. Server Running at [http://localhost:4000](http://localhost:4000)

  

### 2. Deployment
1. run the indexer and api separately
2. make sure indexer and api servers are connected to same database

#### 2.1 Run Indexer
1. ensure `.env` file in project root with configs like in Section 1.1
2. Run Server 
	```sh
	docker compose -f indexer.docker-compose.yml up -d
	```
	2.1 Runs in background
	1.2 ~3k blocks/min @ `MAX_BLOCK_RANGE=500` (300k blocks takes ~2hrs)
	1.3 if you need to restart. recommend cleaning the database to ensure no corrupted data & incorrect api results

#### 2.2 Run GraphQL Server

1. ensure `.env` file in project root with configs like in Section 1.2
1. Run Server
	```sh
	docker compose -f indexer.docker-compose.yml up -d
	```
2. Server Running at [http://localhost:4000](http://localhost:4000)
