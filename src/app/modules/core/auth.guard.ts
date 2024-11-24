import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../shared/services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountSrv = inject(AccountService);
  const account = accountSrv.getAccount();

  if (!account) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
