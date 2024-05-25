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

### 4. Run the command in the sui-dashboard folder

```
npm run build
```



### 5. Copy the generated build folder into your backend directory - backend directory should have server.js, index.html, package.json, .env, and the build folder from step 4


### 6. Run the command in the backend folder

```
npm install
```

### 7. Run the command in the backend folder

```
npm run start
```
or 
```
node server.js
```

You might have to run this multiple times if you get a fetch error, eventually once a connection is made with suiscan it will run without an error.
