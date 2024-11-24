import { Component } from '@angular/core';
import { AccountService } from '../../../../shared/services/account.service';

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrl: './account-dropdown.component.scss'
})
export class AccountDropdownComponent {
  constructor(public accountSrv: AccountService) {};

  disconnectWallet() {
    this.accountSrv.disconnectWallet();
  }

  shortenPubKey(pubKey: string): string {
    if (!pubKey || pubKey.length <= 6) {
      return pubKey; // Return the full key if it's too short
    }
    return `${pubKey.substring(0, 4)}...${pubKey.substring(pubKey.length - 5)}`;
  }
}
