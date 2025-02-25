import { HttpInterceptorFn } from '@angular/common/http';

export const requestInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  let headers = req.headers
    .set("accept", "application/json");

  if (token) {
    headers = headers.set("Authorization", `Bearer ${token}`);
  }

  const request = req.clone({ headers });
  

  return next(request);
};
