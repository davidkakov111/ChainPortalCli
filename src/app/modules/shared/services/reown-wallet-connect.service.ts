import { Injectable } from '@angular/core';
import { AppKit, createAppKit } from '@reown/appkit/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import { environment } from '../../../../environments/environment';

@Injectable({ 
  providedIn: 'root'
})
export class ReownWalletConnectService {
  // AppKit Modal
  appKitModal!: AppKit;

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
    this.appKitModal = createAppKit({
      adapters: [solanaWeb3JsAdapter],
      networks: [solana, solanaTestnet, solanaDevnet],
      defaultNetwork: solanaDevnet, // TODO - Need to change in production
      featuredWalletIds: [
        'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
        '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79'
      ],
      metadata: metadata,
      projectId,
      features: {
        email: false,
        socials: [],
        analytics: false,
        swaps: false,
        onramp: false
      },
      themeMode: 'light', // TODO - need to connect with the material theme mode
      debug: false // TODO - Remove or disable this in production
    })
  }
}

// Installed dependencies for this service:
// @reown/appkit 
// @reown/appkit-adapter-solana 
// @solana/wallet-adapter-phantom 
// @solana/wallet-adapter-solflare