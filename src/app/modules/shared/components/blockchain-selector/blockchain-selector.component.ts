import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

type blockchainNames = 'Ethereum' | 'Solana' | 'Binance Smart Chain' | 'Polygon' | 
  'Cardano' | 'Tezos' | 'Avalanche' | 'Flow' | 'Fantom' | 'Algorand';
export type blockchainSymbols = 'ETH' | 'SOL' | 'BSC' | 'MATIC' | 
  'ADA' | 'XTZ' | 'AVAX' | 'FLOW' | 'FTM' | 'ALGO';
type blockchainCoins = 'ETH' | 'SOL' | 'BNB' | 'MATIC/POL' | 
  'ADA' | 'XTZ' | 'AVAX' | 'FLOW' | 'FTM' | 'ALGO';

interface allBlockchain {
  logo: string;
  name: blockchainNames;
  symbol: blockchainSymbols;
  coin: blockchainCoins;
  description: string;
};

export interface blockchain extends allBlockchain {
  estFee: number;
};

@Component({
  selector: 'app-blockchain-selector',
  templateUrl: './blockchain-selector.component.html',
  styleUrl: './blockchain-selector.component.scss'
})
export class BlockchainSelectorComponent implements OnInit, AfterViewInit {
  // Inputs
  @Input() suportedBlockchains: blockchainSymbols[] = [];
  @Input() title: string = '';

  // Output EventEmitter to emit the selected blockchain symbol
  @Output() blockchainSelected: EventEmitter<blockchain> = new EventEmitter<blockchain>();

  // Viewchilds
  @ViewChild('selectionContainer') selectionContainer: ElementRef | undefined;
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined;

  // Variables
  allBlockchains: allBlockchain[] = [
    { logo: "/images/ethereum-logo.png", name: "Ethereum", symbol:"ETH", coin:"ETH", description: "Decentralized, secure, and highly popular smart contract platform." },
    { logo: "/images/solana-logo.png", name: "Solana", symbol:"SOL", coin:"SOL", description: "High-performance blockchain with fast transaction speeds." },
    { logo: "/images/bsc-logo.png", name: "Binance Smart Chain", symbol:"BSC", coin:"BNB", description: "Low-cost, fast transactions with strong DeFi support." },
    { logo: "/images/polygon-logo.png", name: "Polygon", symbol:"MATIC", coin:"MATIC/POL", description: "Scalable Ethereum-compatible network for faster transactions." },
    { logo: "/images/cardano-logo.png", name: "Cardano", symbol:"ADA", coin:"ADA", description: "Research-driven, proof-of-stake blockchain with sustainable growth." },
    { logo: "/images/tezos-logo.png", name: "Tezos", symbol:"XTZ", coin:"XTZ", description: "Self-amending blockchain for secure, decentralized applications." },
    { logo: "/images/avalanche-logo.png", name: "Avalanche", symbol:"AVAX", coin:"AVAX", description: "High-throughput blockchain with low-latency consensus." },
    { logo: "/images/flow-logo.png", name: "Flow", symbol:"FLOW", coin:"FLOW", description: "Blockchain designed for scalable and user-friendly applications." },
    { logo: "/images/fantom-logo.png", name: "Fantom", symbol:"FTM", coin:"FTM", description: "Fast and scalable blockchain with instant finality." },
    { logo: "/images/algorand-logo.png", name: "Algorand", symbol:"ALGO", coin:"ALGO", description: "High-speed, secure blockchain for decentralized applications." }
  ];
  blockchains: blockchain[] = []
  selectedBlockchain: blockchainSymbols | null = null;

  ngOnInit(): void {
    // Use the suported blockchains, according the input
    for (let bc of this.allBlockchains) {
      if (this.suportedBlockchains.includes(bc.symbol)) {
        this.blockchains.push({...bc, estFee: 0}); // TODO Fee need to be dinamic
      } 
    }
  }

  ngAfterViewInit() {
    const cardWidth = 180;
    const gap = 16; 
    
    // Add max width for the blockchain selection based on number of blockchain cards
    if (this.selectionContainer) {
      this.selectionContainer.nativeElement.style.maxWidth = `${this.blockchains.length * (cardWidth + gap)}px`;
    }
    
    if (this.scrollContainer) {
      // Get the scrolling container and add padding to it as required
      const scrollElement = this.scrollContainer.nativeElement;
      scrollElement.style.paddingLeft = `${scrollElement.clientWidth / 2}px`;
      scrollElement.style.paddingRight = `${scrollElement.clientWidth / 2}px`;

      // Get the height of the card element and adjust the scrollcontainer height as needed
      const cardElement = Array.from(scrollElement.getElementsByClassName('card') as HTMLCollectionOf<HTMLElement>)[0];
      const cardHeight = cardElement ? cardElement.clientHeight : 0;
      const selectedCardHeight = cardHeight * 1.05; // e.g.: transform: scale(1.05);
      scrollElement.style.height = `${selectedCardHeight}px`;

      // Scroll to the first card (no initial gap)
      scrollElement.scrollLeft = (scrollElement.clientWidth / 2)-gap;
  
      // Use a timeout to enable the scroll listener logic after the initial scroll setup
      setTimeout(() => {
        this.setupAutoScroll();
      }, 2000); // Delay for 2 sec to ensure the programmatic scroll has completed    
    }
  }

  // Select and scroll to a blockchain card
  selectBlockchain(symbol: blockchainSymbols) {
    this.selectedBlockchain = symbol;
    this.scrollToSelected();
    const blockchain = this.blockchains.filter(bc => bc.symbol === symbol)[0];
    this.blockchainSelected.emit(blockchain);
  }

  // Check if a blockchain is selected
  isSelected(chainSymbol: blockchainSymbols): boolean {
    return this.selectedBlockchain === chainSymbol;
  }

  // Auto scrolling effect
  setupAutoScroll() {
    if (this.scrollContainer) {
      // Get the scrolling container and add padding to it as required
      const scrollElement = this.scrollContainer.nativeElement;

      // Subscribe to the scroll event of this scroll container
      scrollElement.addEventListener('scroll', () => {
        // Get the horizontal center of the scroll container with the blockchain card elements
        const scrollPosition = scrollElement.scrollLeft + scrollElement.clientWidth / 2;
        const cardElements = Array.from(scrollElement.getElementsByClassName('card') as HTMLCollectionOf<HTMLElement>);

        // Get the closest blockchain card, to the center of the scroll container
        const closestCardSymbol = this.findClosestCard(scrollPosition, cardElements);
        if (closestCardSymbol) {
          this.selectedBlockchain = closestCardSymbol;
          const blockchain = this.blockchains.filter(bc => bc.symbol === closestCardSymbol)[0];
          this.blockchainSelected.emit(blockchain);
        }
      });
    }
  }

  // Find the closest blockchain card element to the scrollPosition of the container (center)
  findClosestCard(scrollPosition: number, cardElements: HTMLElement[]): blockchainSymbols | null {
    let closestCard: any = null;
    let minDistance = Infinity;

    cardElements.forEach((card: any) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - scrollPosition);

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    return closestCard ? closestCard?.getAttribute('data-symbol') : null;
  }

  // Scroll to the blockchain card selected by the user when they click on it.
  scrollToSelected() {
    if (this.selectedBlockchain && this.scrollContainer) {
      const selectedCard = Array.from(this.scrollContainer.nativeElement.getElementsByClassName('card') as HTMLCollectionOf<HTMLElement>)
        .find((card: HTMLElement) => card.getAttribute('data-symbol') === this.selectedBlockchain);

      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }
}
