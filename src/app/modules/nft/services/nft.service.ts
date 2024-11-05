import { Injectable } from '@angular/core';
import { NftMetadata } from '../components/mint/nft-metadata/nft-metadata.component';

export type mintStep = 'step1';

@Injectable({
  providedIn: 'root'
})
export class NftService {
  constructor() { }

  // Data to track the user's mint process
  private mintProcess = {
    step1: {completed: false, data: {} as NftMetadata}
  }

  // General step handlers
  stepCompleted(step: mintStep) {
    return this.mintProcess[step].completed;
  }
  getStepData(step: mintStep): any {
    return this.mintProcess[step].data;
  }
  removeStepData (step: mintStep) {
    this.mintProcess[step].data = {} as any;
    this.mintProcess[step].completed = false;
  }
 
  // Individual handlers for setting step data
  setNftMetadata (nftMetadata: NftMetadata) {
    this.mintProcess.step1.data = nftMetadata;
    this.mintProcess.step1.completed = true;
  }
  
}
