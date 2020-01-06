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

# Questions
- Read this for data types
- Creating `enum` in go