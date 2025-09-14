import { CanActivateFn, Router } from '@angular/router';
// import { Location } from '@angular/common';
import { inject } from '@angular/core';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const location = new Location();
  const isLoggedIn = !!localStorage.getItem('token');

  if (isLoggedIn) {
    router.navigateByUrl(state.url);
    return false;
  } else {
    return true
  }
};
