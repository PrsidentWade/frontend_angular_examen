import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../Service/authservice.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthserviceService);

  if (auth.isAdmin()) {
    return true;
  }

  router.navigate(['/home/projet']);
  return false;
};
