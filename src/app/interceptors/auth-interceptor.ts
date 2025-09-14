import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('token');
  let cloneReq = null;
  if (token) {
    cloneReq = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    return next(cloneReq);
  }
  return next(req);
};
