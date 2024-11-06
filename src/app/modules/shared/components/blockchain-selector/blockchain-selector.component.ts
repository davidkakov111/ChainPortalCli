import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

type blockchainNames = 'Ethereum' | 'Solana' | 'Binance Smart Chain' | 'Polygon' | 
  'Cardano' | 'Tezos' | 'Avalanche' | 'Flow' | 'Fantom' | 'Algorand';

interface blockchain {
  logo: string;
  name: blockchainNames;
  description: string;
};

@Component({
  selector: 'app-blockchain-selector',
  templateUrl: './blockchain-selector.component.html',
  styleUrl: './blockchain-selector.component.scss'
})
export class BlockchainSelectorComponent implements OnInit, AfterViewInit {
  // Inputs
  @Input() suportedBlockchains: blockchainNames[] = [];
  @Input() title: string = '';

  // Viewchilds
  @ViewChild('selectionContainer') selectionContainer: ElementRef | undefined;
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined;

  // Variables
  allBlockchains: blockchain[] = [
    { logo: "/images/ethereum-logo.png", name: "Ethereum", description: "Most popular and widely used for NFTs and tokens" },
    { logo: "/images/solana-logo.png", name: "Solana", description: "High-performance blockchain known for speed and low fees" },
    { logo: "/images/bsc-logo.png", name: "Binance Smart Chain", description: "Fast transactions with low fees, ideal for DeFi and tokens" },
    { logo: "/images/polygon-logo.png", name: "Polygon", description: "Layer-2 scaling solution for Ethereum, low fees" },
    { logo: "/images/cardano-logo.png", name: "Cardano", description: "Research-driven platform with a focus on sustainability" },
    { logo: "/images/tezos-logo.png", name: "Tezos", description: "Upgradable, energy-efficient blockchain for NFTs and smart contracts" },
    { logo: "/images/avalanche-logo.png", name: "Avalanche", description: "Decentralized platform for applications and enterprise solutions" },
    { logo: "/images/flow-logo.png", name: "Flow", description: "Built specifically for NFTs, powering NBA Top Shot and others" },
    { logo: "/images/fantom-logo.png", name: "Fantom", description: "Scalable, EVM-compatible blockchain for DeFi and NFTs" },
    { logo: "/images/algorand-logo.png", name: "Algorand", description: "Fast, carbon-negative blockchain with strong DeFi support" }
  ];
  blockchains: blockchain[] = []
  selectedBlockchain: blockchainNames | null = null;

  ngOnInit(): void {
    // Use the suported blockchains, according the input
    for (let bc of this.allBlockchains) {
      if (this.suportedBlockchains.includes(bc.name)) {
        this.blockchains.push(bc);
      } 
    }
  }

  ngAfterViewInit() {
    // Add max width for the blockchain selection based on number of blockchain cards
    if (this.selectionContainer) {
      const cardWidth = 180;
      const gap = 16; 
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
      scrollElement.scrollLeft = scrollElement.clientWidth / 2;
  
      // Use a timeout to enable the scroll listener logic after the initial scroll setup
      setTimeout(() => {
        this.setupAutoScroll();
      }, 2000); // Delay for 2 sec to ensure the programmatic scroll has completed    
    }
  }

  // Select and scroll to a blockchain card
  selectBlockchain(name: blockchainNames) {
    this.selectedBlockchain = name;
    this.scrollToSelected();
  }

  // Check if a blockchain is selected
  isSelected(chainName: blockchainNames): boolean {
    return this.selectedBlockchain === chainName;
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
        const closestCardName = this.findClosestCard(scrollPosition, cardElements);
        if (closestCardName) {
          this.selectedBlockchain = closestCardName;
        }
      });
    }
  }

  // Find the closest blockchain card element to the scrollPosition of the container (center)
  findClosestCard(scrollPosition: number, cardElements: HTMLElement[]): any {
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

    return closestCard ? closestCard?.getAttribute('data-name') : null;
  }

  // Scroll to the blockchain card selected by the user when they click on it.
  scrollToSelected() {
    if (this.selectedBlockchain && this.scrollContainer) {
      const selectedCard = Array.from(this.scrollContainer.nativeElement.getElementsByClassName('card') as HTMLCollectionOf<HTMLElement>)
        .find((card: HTMLElement) => card.getAttribute('data-name') === this.selectedBlockchain);

      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }
}
