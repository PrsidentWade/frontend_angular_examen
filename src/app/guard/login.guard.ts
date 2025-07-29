import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../Service/authservice.service';
import { inject } from '@angular/core';

export const loginGuard = () => {
  const router = inject(Router);
  const auth = inject(AuthserviceService);

  if (!auth.isAuthenticated()) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};

