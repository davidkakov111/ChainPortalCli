import { Injectable } from '@angular/core';
import { NftMetadata } from '../components/mint/nft-metadata/nft-metadata.component';
import { blockchainSymbols } from '../../shared/components/blockchain-selector/blockchain-selector.component';

export type mintStep = 'step1' | 'step2';
interface selectedBChain { symbol: blockchainSymbols };

@Injectable({
  providedIn: 'root'
})
export class NftService {
  constructor() { }

  // Data to track the user's mint process
  private mintProcess = {
    step1: {completed: false, data: {} as NftMetadata},
    step2: {completed: false, data: {} as selectedBChain}
  }

  // General step handlers
  stepCompleted(step: mintStep) {
    return this.mintProcess[step].completed;
  }
  getStepData(step: mintStep): any {
    return this.mintProcess[step].data;
  }
  removeStepData(step: mintStep) {
    this.mintProcess[step].data = {} as any;
    this.mintProcess[step].completed = false;
  }
 
  // Individual handlers for setting step data
  setNftMetadata(nftMetadata: NftMetadata) {
    this.mintProcess.step1.data = nftMetadata;
    this.mintProcess.step1.completed = true;
  }
  setSelectedBlockchain(blockchainSymbol: blockchainSymbols) {
    this.mintProcess.step2.data = { symbol: blockchainSymbol };
    this.mintProcess.step2.completed = true;
  }
  
}
