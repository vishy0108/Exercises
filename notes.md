# Steps
- Create a directory `artifacts` and `src`
- `artifacts` will have the network related settings
- `src` will have the node js SDK code
- Inside the `artifacts` directory, create a `channel` directory
- `channel` shall have the crypto-config.yaml and configtx.yaml
- `crypto-config.yaml` defines the participating organizations and peers
- `configtx.yaml` defines the MSPs, Anchor Peers, Network policies, Roles, consensus type and batch timeout/size
- `artifacts` will have a java like folder structure `src/github.com/hf-supply-chain` where go contracts would reside

# Contract
- Creating an order
- Fulfilling an order via Producer, Shipper, Retailer at various stages
- An auditor to monitor the transparency

# Questions/General Info
- Read [this](https://github.com/hyperledger/fabric-contract-api-go/blob/master/tutorials/getting-started.md#writing-contract-functions) for data types
- Creating `enum` in go contract
- `TransactionContext` has the following methods:
    1. GetID()
    2. GetMSPID()
    3. GetAttributeValue(string)
    4. GetX509Certificate()

    Reference [here](https://github.com/hyperledger/fabric-contract-api-go/blob/master/contractapi/transaction_context_test.go)
- In Solidity, we have `Global State Variables` defined. Whenever a transaction executed, changes made to these are automatically stored to the ledger. However, in case of `Hyperledger Fabric`, this is approached differently. All those variables whose state needs to be maintained, should manually be updated within the smart contract.