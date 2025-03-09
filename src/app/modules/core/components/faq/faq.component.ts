import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  standalone: false
})
export class FaqComponent {
  questions: {q: string, a: string}[] = [
    {q: 'What is ChainPortal?', a: 'ChainPortal is a streamlined platform that allows you to manage NFTs and tokens across blockchains with low fees and user-friendly tools for creating and managing assets securely.'},
    {q: 'What blockchains are currently supported?', a: 'Currently, ChainPortal supports the Solana blockchain. Additional blockchains will be integrated in the future to offer users more flexibility.'},
    {q: 'What file types are supported for NFTs?', a: 'ChainPortal supports a wide range of file types, including images, 3D objects, videos, and audio files, providing flexibility for your creative needs.'},
    {q: 'How long does the minting process take?', a: 'Minting typically completes within seconds, but the duration may vary depending on the blockchain selected and network conditions.'},
    {q: 'Is my metadata secure?', a: 'Yes. Metadata is securely stored on IPFS, ensuring decentralized and tamper-proof storage in line with Web3 principles.'},
    {q: 'What happens if the minting process fails?', a: 'If the minting process fails, your funds will be returned automatically to your wallet after deducting the applicable fee(s). You can retry the process after checking for errors or network conditions.'},
    {q: 'Where can I find my minted tokens or NFTs?', a: 'Once minted, your tokens or NFTs will be sent directly to your connected wallet, where you can view them immediately.'}
  ];

  constructor(private seoSrv: SeoService) {
    // Dynamically build the mainEntity array for structured data
    const mainEntity = this.questions.map(question => ({
      "@type": "Question",
      "name": question.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": question.a
      }
    }));

    this.seoSrv.setPageSEO('FAQ', 'Frequently asked questions related to ChainPortal.', {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": mainEntity
    });
  }
}
