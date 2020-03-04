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