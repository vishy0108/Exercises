# Steps

- Create a directory `network`, `chaincode` and `application`
- `network` will have the network related settings
- Inside the `network` directory, create crypto-config.yaml and configtx.yaml
- `crypto-config.yaml` defines the participating organizations and peers
- `configtx.yaml` defines the MSPs, Anchor Peers, Network policies, Roles, consensus type and batch timeout/size
- `chaincode` will have the GO smart contracts code
- `chaincode` will have a java like folder structure `src/github.com/hf-supply-chain` where go contracts would reside

# Contract

- Creating an order
- Fulfilling an order via Producer, Shipper, Retailer at various stages
- An auditor to monitor the transparency

# Questions/General Info

- Read [this](https://github.com/hyperledger/fabric-contract-api-go/blob/master/tutorials/getting-started.md#writing-contract-functions) for data types
- Creating `enum` in go contract
- User Registration involves:

  1. Admin registering the user with a name, password(`optional`) and role
  2. Upon registering it returns the password/secret of the user. Secret will be same as step 1, if supplied during registration. Otherwise, a randomly generated secret would be assigned.
  3. Pass it on to the user and he/she needs to enroll the first time to get X509 certificates generated

  In short, admin registers user -> MSP provides access to the user -> user then requests certs using CSR(Certificate Signing Request). Separation of registering/enrolling is to make sure only the specific user has access to the signing certs.

- `TransactionContext` has the following methods:

  1. GetID()
  2. GetMSPID()
  3. GetAttributeValue(string)
  4. GetX509Certificate()

  Reference [here](https://github.com/hyperledger/fabric-contract-api-go/blob/master/contractapi/transaction_context_test.go)

- In Solidity, we have `Global State Variables` defined. Whenever a transaction executed, changes made to these are automatically stored to the ledger. However, in case of `Hyperledger Fabric`, this is approached differently. All those variables whose state needs to be maintained, should manually be updated using `ctx.GetStub().GetState` and/or `ctx.GetStub().PutState` within the smart contract itself.
