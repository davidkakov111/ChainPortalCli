import { Injectable } from '@angular/core';
import { AppKit, createAppKit } from '@reown/appkit/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import { environment } from '../../../../environments/environment';

@Injectable({ 
  providedIn: 'root'
})
export class ReownWalletConnectService {
  // AppKit Modal
  appKit!: AppKit;

  constructor() {this.createModal()}

  // Create modal to connect wallet
  async createModal() {
    // Lazy Loading the solana adapters to avoid the build process from attempting to parse the Solana-related code when building.
    const { SolanaAdapter } = await import('@reown/appkit-adapter-solana/react');
    const { PhantomWalletAdapter } = await import('@solana/wallet-adapter-phantom');
    const { SolflareWalletAdapter } = await import('@solana/wallet-adapter-solflare');

    // 0. Set up Solana Adapter
    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
    })

    // 1. Get projectId from https://cloud.reown.com
    const projectId = environment.reownProjectId;

    // 2. Create a metadata object - optional
    const metadata = {
      name: 'ChainPortal',
      description: 'Your all-in-one platform for managing crypto assets!',
      url: 'https://chainportal.vercel.app/', // origin must match your domain & subdomain
      icons: ['https://avatars.githubusercontent.com/u/179229932'] // TODO - Maybe i need to change it
    }

    // 3. Create modal
    this.appKit = createAppKit({
      adapters: [solanaWeb3JsAdapter],
      networks: [solana, solanaTestnet, solanaDevnet],
      metadata: metadata,
      projectId,
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