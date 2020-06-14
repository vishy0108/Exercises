export FABRIC_CFG_PATH=${PWD}/config
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/crypto-config/ordererOrganizations/abacsupplychain.io/orderers/orderer.abacsupplychain.io/msp/tlscacerts/tlsca.abacsupplychain.io-cert.pem

# For docker cli only
setGlobalsForPeerAndOrg() {
    ORG_NAME=$1
    ORG_MSP_ID=$2
    PEER_NAME=$3
    PEER_PORT=$4

    CLI_BASE_PATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto

    PEER_TLS_ROOTCERT=${CLI_BASE_PATH}/peerOrganizations/$ORG_NAME/peers/$PEER_NAME.$ORG_NAME/tls/ca.crt
    PEER_TLS_CERT=${CLI_BASE_PATH}/peerOrganizations/$ORG_NAME/peers/$PEER_NAME.$ORG_NAME/tls/server.crt
    PEER_TLS_KEY=${CLI_BASE_PATH}/peerOrganizations/$ORG_NAME/peers/$PEER_NAME.$ORG_NAME/tls/server.key

    export CORE_PEER_LOCALMSPID=$ORG_MSP_ID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER_TLS_ROOTCERT
    export CORE_PEER_TLS_CERT_FILE=$PEER_TLS_CERT
    export CORE_PEER_TLS_KEY_FILE=$PEER_TLS_KEY
    export CORE_PEER_MSPCONFIGPATH=${CLI_BASE_PATH}/peerOrganizations/$ORG_NAME/users/Admin@$ORG_NAME/msp
    export CORE_PEER_ADDRESS=peer0.${ORG_NAME}:${PEER_PORT}
}
