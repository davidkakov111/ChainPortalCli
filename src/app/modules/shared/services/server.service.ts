import { Injectable } from '@angular/core';
import { assetType, blockchainSymbols, operationType } from '../components/blockchain-selector/blockchain-selector.component';
import { NftMetadata } from '../../nft/components/mint/nft-metadata/nft-metadata.component';
import { transactionHistory } from '../../core/components/account/transaction-history/transaction-history.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Environment {
  reownProjectId: string,
  blockchainNetworks: {
    solana: {
      selected: 'devnet' | 'mainnet',
      pubKey: string,
    }, 
  },
}

export type blockchainFees = Partial<Record<blockchainSymbols, number>>;

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private router: Router, private http: HttpClient) {}

  private serverEndpoint: string = "http://localhost:3000";
  private environment!: Environment;

  // Load & return the environment details from server
  async getEnvironment(): Promise<Environment> {
    if (!this.environment) {
      this.environment = await firstValueFrom(this.http.get<Environment>(this.serverEndpoint + '/cli-env'));
    }
    return this.environment;
  }

  // Get fees for different operation types and assets across multiple blockchains
  async getFees(
    assetType: assetType, operationType: operationType, blockchains: blockchainSymbols[], metadataByteSize: number = 0
  ): Promise<blockchainFees> {

    let blockchainFees: blockchainFees = {};

    if (operationType === "mint") {
      let bChainSymbolsString = blockchains.join(',');
      blockchainFees = await firstValueFrom(this.http.get<blockchainFees>(
        `${this.serverEndpoint}/mint-fees?assetType=${assetType}&blockchainSymbol=${bChainSymbolsString}&metadataByteSize=${metadataByteSize}`));
    } else if (operationType === "bridge") {
      // TODO - Implement bridge fee calculations later
    }

    return blockchainFees;
  }

  // Get all transaction history by publick key
  async getAllTxHistory(pubKey: string): Promise<transactionHistory[]> {

    // TODO - Need to fetch this from server
    const transactionHistoryTable: {
      id: number,
      assetType: assetType,
      operationType: operationType,
      blockchain: blockchainSymbols,
      publickKey?: string,
      paymentTxSignature: string,
      revardTxSignature: string,
      date: Date
    }[] = [
      {
        id: 1,
        assetType: 'NFT',
        operationType: 'mint',
        blockchain: 'SOL',
        publickKey: '3fiR9sB9ND5MvQYjzCZAqoMcTzZkFL3kXFxAb857s4TB',
        paymentTxSignature: 'sdgsdgsdgsdgsdg',
        revardTxSignature: 'sgssgsdgsdssd',
        date: new Date('Sun Nov 24 2024 20:14:14 GMT+0200 (Eastern European Standard Time)')
      },
      {
        id: 2,
        assetType: 'Token',
        operationType: 'bridge',
        blockchain: 'ETH',
        publickKey: '3fiR9sB9ND5MvQYjzCZAqoMcTzZkFL3kXFxAb857s4TB',
        paymentTxSignature: 'dgsdgsdgsdgsdgsdg',
        revardTxSignature: 'sggsdgsdgssgsdgsdssd',
        date: new Date('Sun Nov 24 2024 20:14:13 GMT+0200 (Eastern European Standard Time)')
      },
      {
        id: 3,
        assetType: 'NFT',
        operationType: 'mint',
        blockchain: 'SOL',
        publickKey: 'sgsdgsdggsgsgsdgsrgrgsrgg',
        paymentTxSignature: 'FwkLbdeU9NR2axv2QNKTpWJ1ZSH7bgXAJJRpxFcFuRWz',
        revardTxSignature: 'sgssgsdgsoihubjndssd',
        date: new Date('Sun Nov 24 2024 20:16:14 GMT+0200 (Eastern European Standard Time)')
      },
      {
        id: 4,
        assetType: 'Token',
        operationType: 'mint',
        blockchain: 'ETH',
        publickKey: '3fiR9sB9ND5MvQYjzCZAqoMcTzZkFL3kXFxAb857s4TB',
        paymentTxSignature: 'ssgdgsdgsdgsdgsdg',
        revardTxSignature: 'sgsssdggsdgsdssd',
        date: new Date('Sun Nov 24 2024 20:14:17 GMT+0200 (Eastern European Standard Time)')
      },
    ]
    const pubKeyHistory = transactionHistoryTable.filter(tx => tx.publickKey === pubKey);
    pubKeyHistory.forEach(obj => {delete obj.publickKey});

    return (pubKeyHistory as unknown) as transactionHistory[];
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

    const txId = 1; // This transaction record id should come from the server db.

    // If the payment is valid and the transaction ID is received, navigate to the transaction details page.
    if (txId) {
      this.router.navigateByUrl(`/profile/transaction-history/${txId}`);
    }
  }
}
