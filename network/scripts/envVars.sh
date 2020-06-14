export FABRIC_CFG_PATH=${PWD}/config
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/crypto-config/ordererOrganizations/abacsupplychain.io/orderers/orderer.abacsupplychain.io/msp/tlscacerts/tlsca.abacsupplychain.io-cert.pem

setGlobalsForPeerAndOrg() {
    ORG_NAME=$1
    ORG_MSP_ID=$2
    PEER_NAME=$3
    PEER_PORT=$4

    PEER_TLS_ROOTCERT=${PWD}/crypto-config/peerOrganizations/$ORG_NAME/peers/$PEER_NAME.$ORG_NAME/tls/ca.crt

    export CORE_PEER_LOCALMSPID=$ORG_MSP_ID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER_TLS_ROOTCERT
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/$ORG_NAME/users/Admin@$ORG_NAME/msp
    export CORE_PEER_ADDRESS=localhost:$PEER_PORT
}
