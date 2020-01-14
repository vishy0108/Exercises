import FabricCAServices from "fabric-ca-client";
import {
  Gateway,
  Wallets,
  Wallet,
  Identity,
  X509Identity,
} from "fabric-network";
import { resolve } from "path";
import * as fs from "fs";
import { GatewayNotConnectedError, IdentityNotFoundError } from "../errors";

export class FabricCAClient {
  private ccp;
  private wallet: Wallet;
  private gateway: Gateway;

  private gatewayConnected: boolean;

  public async connect(identity: string) {
    this.gateway = new Gateway();

    const connectionProfileJson = "../config/connection.json";
    const ccpPath = resolve(__dirname, connectionProfileJson);
    this.ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const walletpath = "../config/wallet";
    this.wallet = await Wallets.newFileSystemWallet(walletpath);

    const idExists = await this.wallet.get(identity);
    if (!idExists) {
      throw new IdentityNotFoundError();
    }

    await this.gateway.connect(this.ccp, {
      wallet: this.wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    this.gatewayConnected = true;
  }

  private disconnect() {
    if (!this.gatewayConnected) {
      return;
    }

    this.gateway.disconnect();
  }

  private async getContract() {
    if (!this.gatewayConnected) {
      throw new GatewayNotConnectedError();
    }

    const channelName = "";
    console.log(`Use network channel: ${channelName}`);

    // Get addressability to the smart contract as specified in config
    const network = await this.gateway.getNetwork(channelName);
    const smartContractName = "";
    console.log(`Use  smart contract ${smartContractName}`);

    const contract = await network.getContract(smartContractName);
    return contract;
  }

  public async registerUser(
    userID: string,
    pwd: string,
    userType: string,
    adminIdentity: Identity
  ) {
    if (!this.gatewayConnected) {
      throw new GatewayNotConnectedError();
    }

    const orgs = this.ccp.organizations;
    const CAs = this.ccp.certificateAuthorities;
    const orgMSPID = this.ccp.client.organization;
    const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
    const caURL = CAs[fabricCAKey].url;
    const ca = new FabricCAServices(caURL);

    const newUserDetails = {
      enrollmentID: userID,
      enrollmentSecret: pwd,
      role: "client",
      affiliation: orgMSPID,
      profile: "tls",
      attrs: [
        {
          name: "usertype",
          value: userType,
          ecert: true,
        },
      ],
      maxEnrollments: 5,
    };

    const provider = this.wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    const secret = await ca.register(newUserDetails, adminUser);
    console.log(`Successfully registered user ${userID}`);
    return secret;
  }

  public async enrollUser(userID: string, pwd: string, userType: string) {
    if (!this.gatewayConnected) {
      throw new GatewayNotConnectedError();
    }

    const orgs = this.ccp.organizations;
    const CAs = this.ccp.certificateAuthorities;
    const orgMSPID = this.ccp.client.organization;
    const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
    const caURL = CAs[fabricCAKey].url;
    const ca = new FabricCAServices(caURL);

    const newUserDetails = {
      enrollmentID: userID,
      enrollmentSecret: pwd,
      role: "client",
      affiliation: orgMSPID,
      profile: "tls",
      attrs: [
        {
          name: "usertype",
          value: userType,
          ecert: true,
        },
      ],
      maxEnrollments: 5,
    };

    const enrollment = await ca.enroll(newUserDetails);
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await this.wallet.put(userID, x509Identity);
    console.log("Sucessfully enrolled user and imported identity to wallet");
  }

  public async submitTransaction(...args) {
    if (!this.gatewayConnected) {
      throw new GatewayNotConnectedError();
    }

    const contract = await this.getContract();
    const response = await contract.submitTransaction(...args);
    return response.toString();
  }
}
