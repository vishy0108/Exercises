# Import
. scripts/envVars.sh

CHANNEL_PROFILE="FourOrgsSupplyChainChannel"
CHANNEL_NAME="fourorgssupplychainchannel"

clean() {
    rm ./channel-artifacts/*.tx
}

createChannelTx() {
    echo
    echo "###################################################################"
    echo "###  Generating channel configuration transaction  '${CHANNEL_NAME}.tx' ###"
    echo "###################################################################"
    set -x
    configtxgen -profile $CHANNEL_PROFILE -outputCreateChannelTx ./channel-artifacts/$CHANNEL_NAME.tx -channelID $CHANNEL_NAME -configPath $PWD
    res=$?
    set +x
    if [ $res -ne 0 ]; then
        echo "Failed to generate channel configuration transaction..."
        exit 1
    fi
}

createChannel() {

    CA_FILE_ADMIN_USER=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/abacsupplychain.io/orderers/orderer.abacsupplychain.io/msp/tlscacerts/tlsca.abacsupplychain.io-cert.pem

    docker exec cli peer channel create -o orderer.abacsupplychain.io:7050 \
        -c $CHANNEL_NAME -f ./channel-artifacts/${CHANNEL_NAME}.tx --cafile $CA_FILE_ADMIN_USER --tls true
}

joinChannel() {
    BLOCK_PATH="fourorgssupplychainchannel.block"

    docker exec cli peer channel join -b $BLOCK_PATH

    setGlobalsForPeerAndOrg producer.abacsupplychain.io ProducerMSP peer0 8051
    docker exec -e CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH} -e CORE_PEER_ADDRESS=${CORE_PEER_ADDRESS} -e CORE_PEER_LOCALMSPID=${CORE_PEER_LOCALMSPID} -e CORE_PEER_TLS_ROOTCERT_FILE=${CORE_PEER_TLS_ROOTCERT_FILE} cli peer channel join -b $BLOCK_PATH

    setGlobalsForPeerAndOrg shipper.abacsupplychain.io ShipperMSP peer0 9051
    docker exec -e CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH} -e CORE_PEER_ADDRESS=${CORE_PEER_ADDRESS} -e CORE_PEER_LOCALMSPID=${CORE_PEER_LOCALMSPID} -e CORE_PEER_TLS_ROOTCERT_FILE=${CORE_PEER_TLS_ROOTCERT_FILE} cli peer channel join -b $BLOCK_PATH

    setGlobalsForPeerAndOrg regulator.abacsupplychain.io RegulatorMSP peer0 10051
    docker exec -e CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH} -e CORE_PEER_ADDRESS=${CORE_PEER_ADDRESS} -e CORE_PEER_LOCALMSPID=${CORE_PEER_LOCALMSPID} -e CORE_PEER_TLS_ROOTCERT_FILE=${CORE_PEER_TLS_ROOTCERT_FILE} cli peer channel join -b $BLOCK_PATH
}

createAnchorPeerTx() {

    for org in RetailerOrg ProducerOrg ShipperOrg RegulatorOrg; do

        echo
        echo "#####################################################################"
        echo "#######  Generating anchor peer update for ${org}          ##########"
        echo "#####################################################################"
        set -x
        configtxgen -profile $CHANNEL_PROFILE -outputAnchorPeersUpdate ./channel-artifacts/${org}Anchors.tx -channelID $CHANNEL_NAME -asOrg ${org} -configPath $PWD
        res=$?
        set +x
        if [ $res -ne 0 ]; then
            echo "Failed to generate anchor peer update for ${org}..."
            exit 1
        fi

    done
}

clean
createChannelTx
createChannel
joinChannel
