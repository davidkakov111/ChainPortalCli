import { Injectable } from '@angular/core';

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
}
