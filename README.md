# How to set up?

### 1. Environment Variables
backend needs a .env file that contains the following:

```
CHAIN_NAME=mainnet
PING_INTERVAL=1
ACC1_PRIVATE_KEY=suiprivkey
ACC2_PRIVATE_KEY=suiprivkey1
URL=https://sui-mainnet-rpc.allthatnode.com
API_KEY=API-KEY from https://api.blockberry.one
```

### 2. Run the command

```
npx create-react-app sui-dashboard
```

### 3. Move App.css and App.js from this github to sui-dashboard/src

### 4. Run the command

```
npm run build
```
in the sui-dashboard directory

### 4. Copy the generated build folder into your backend directory

### 5. Run the command

```
npm run start
```
