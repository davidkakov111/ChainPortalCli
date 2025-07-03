import { Injectable } from '@angular/core';
import { assetType, blockchainSymbols, operationType } from '../components/blockchain-selector/blockchain-selector.component';
import { transactionHistory } from '../../core/components/account/transaction-history/transaction-history.component';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

export interface Environment {
  reownProjectId: string,
  blockchainNetworks: {
    solana: {
      selected: 'devnet' | 'mainnet',
      pubKey: string,
    }, 
    ethereum: {
      selected: 'sepolia' | 'mainnet',
      pubKey: string,
    }, 
  },
}

export interface transaction {
  id: number,
  operationType: operationType,
  assetType: assetType,
  blockchain: blockchainSymbols,
  paymentPubKey: string,
  paymentAmount: number,
  date: Date,
  MintTxHistories?: {
    id: number,
    mainTxHistoryId: number,
    paymentTxSignature: string,
    rewardTxs: {
      txSignature: string,
      type: string // ex.: mint | metadataUpload etc.
    }[]
  }[],
  // TODO - Add Bridge tx history table later
}

export type blockchainFees = Partial<Record<blockchainSymbols, number>>;

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private http: HttpClient) {}
  sayHi() {
    alert('Hi')
}
  serverEndpoint: string = "https://server.chainportal.app"; // "http://localhost:3000"; 
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
    return await firstValueFrom(this.http.get<transactionHistory[]>(this.serverEndpoint + `/all-tx-history?pubkey=${pubKey}`));
  }

  // Get transaction details from db by main transaction id
  getTxDetails(txId: number): Observable<transaction> {
    return this.http.get<transaction>(`${this.serverEndpoint}/tx-details?txId=${txId}`);
  }

  // Save feedback
  saveFeedback(feedback: {rating: number, feedback: string, afterUse: boolean, ip: any}): Observable<any> {
    return this.http.post<any>(this.serverEndpoint+'/submit-feedback', feedback);
  }
}
