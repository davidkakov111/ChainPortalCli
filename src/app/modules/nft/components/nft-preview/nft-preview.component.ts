import { Component, Input } from '@angular/core';
import { NftMetadata } from '../mint/nft-metadata/nft-metadata.component';

@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrl: './nft-preview.component.scss'
})
export class NftPreviewComponent {
  // Inputs
  @Input() nftMetadata!: NftMetadata;
}
