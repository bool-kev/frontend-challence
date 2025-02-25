import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs';

export const isLoggInGuard: CanActivateFn = (route, state) => {
  const authService=inject(AuthService);
  const router=inject(Router);
  
  if(authService.user()) return true;
  else if(authService.user()===null) {
    router.navigate(['/login']);
    return false;
  };
  return authService.getUser().pipe(
    map(user => {
      if(user===null) router.navigate(['/login']);
      return user!=null;
    })
  );
};
