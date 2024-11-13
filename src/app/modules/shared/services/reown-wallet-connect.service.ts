import { Injectable } from '@angular/core';
import { AppKit, createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { environment } from '../../../../environments/environment';

@Injectable({ 
  providedIn: 'root'
})
export class ReownWalletConnectService {
  // 0. Set up Solana Adapter
  solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
  })

  // 1. Get projectId from https://cloud.reown.com
  projectId = environment.reownProjectId;

  // 2. Create a metadata object - optional
  metadata = {
    name: 'ChainPortal',
    description: 'Your all-in-one platform for managing crypto assets!',
    url: 'https://chainportal.vercel.app/', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932'] // TODO - Maybe i need to change it
  }

  // AppKit Modal
  appKit!: AppKit;

  constructor() {
    // 3. Create modal
    this.appKit = createAppKit({
      adapters: [this.solanaWeb3JsAdapter],
      networks: [solana, solanaTestnet, solanaDevnet],
      metadata: this.metadata,
      projectId: this.projectId,
      features: {
        analytics: true // Optional - defaults to your Cloud configuration
      }
    })
  }
}

// Installed dependencies for this service:
// @reown/appkit 
// @reown/appkit-adapter-solana 
// @solana/wallet-adapter-phantom 
// @solana/wallet-adapter-solflare
// You can try modifying the code where __filename is referenced using fileURLToPath(import.meta.url) instead.