import { Injectable } from '@angular/core';
import { assetType, blockchainSymbols, operationType } from '../components/blockchain-selector/blockchain-selector.component';
import { NftMetadata } from '../../nft/components/mint/nft-metadata/nft-metadata.component';

export interface Environment {
  reownProjectId: string,
  blockchainNetworks: {
    solana: {
      selected: 'devnet' | 'mainnet',
      pubKey: string,
    }, 
  },
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor() { }

  private environment!: Environment;

  // Load & return the environment details from server
  async getEnvironment(): Promise<Environment> {
    if (!this.environment) {
      // TODO - Need to fetch this from server
      this.environment = {
        reownProjectId: 'f9475d25490661ea7876f3be596b200d',
        blockchainNetworks: {
          solana: {
            selected: "devnet",
            pubKey: "FwkLbdeU9NR2axv2QNKTpWJ1ZSH7bgXAJJRpxFcFuRWz",
          }, 
        },
      }
    }

    return this.environment;
  }

  // Get fees for different operation types and assets across multiple blockchains
  async getFees(assetType: assetType, operationType: operationType, blockchains: blockchainSymbols[]): Promise<
    {blockchainSymbol: blockchainSymbols, fee: number}[]
  > {
    // TODO - Need to fetch this from server
    const feeDb = {
      NFT: {
        mint: {SOL: 0.01},
        bridge: {SOL: 0.01}
      },
      Token: {
        mint: {SOL: 0.01},
        bridge: {SOL: 0.01}
      }
    }

    const response: {blockchainSymbol: blockchainSymbols, fee: number}[] = [];
    for (let bc of blockchains) {
      if (bc in feeDb[assetType][operationType]) {
        response.push({blockchainSymbol: bc, fee: (feeDb[assetType][operationType] as any)[bc]});
      }      
    }
    return response;
  }

  // Post the payment details to the server for further processing.
  async payment(
    assetType: assetType, 
    operationType: operationType, 
    blockchain: blockchainSymbols, 
    paymentTxSignature: string, 
    data:  NftMetadata | any
  ) {
    console.log('Send the payment to server: ', assetType, operationType, blockchain, paymentTxSignature, data);
    // TODO - Need to post to the server for payment validation, etc. The media file is also need to be sent to the server somehov.
  }
}
