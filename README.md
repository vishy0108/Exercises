# Introduction

In supply chain, confidentiality is mandatory because some consumers might be given discounted rates compared to others. In this scenario, other consumers should not be able to access their competitors’ rates.

This application demonstrates confidentiality, by registering each user with a specific attribute, called usertype. This takes advantage of the attribute based access control(`ABAC`). These attributes are checked inside `Go` smart contract before further operations.
The usertype can be either

- an admin
- a regulator
- a producer
- a shipper
- a retailer, or
- a customer

It is generated when a specific user registers in the application. When that user logs in successfully and connects to an instance of the Hyperledger Fabric network, their usertype gives them access to certain transactions that have been submitted on the network. For example, the regulator (such as the FDA) is able to view all transactions on the network in order to reliably audit the network, but the retailer is only able to view the transactions that they are a part of.

# Run Instructions

- ```sh
  cd network

  # Generate relevant crypto material, genesis block and bootstrap docker containers
  ./network.sh up

  # Create channel tx, application channel block and join all peers
  ./scripts/createChannel.sh
  ```

- ```sh
  # Start explorer
  docker-compose -f docker-compose-explorer.yaml up -d
  ```

- ```sh
   # Teardown setup
   docker-compose -f docker-compose-explorer.yaml down --volumes
  ./network.sh down
  ```

# Client application

Angular app for client side is from IBM repo
