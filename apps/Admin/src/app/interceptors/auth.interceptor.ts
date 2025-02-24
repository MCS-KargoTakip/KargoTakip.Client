import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImE5YjY3ZTU2LWQ3YzktNDRmOS05NDJkLTZmNzc0ZDI4ZTc4NiIsIm5iZiI6MTc0MDA2MjI0MCwiZXhwIjoxNzQyNDgxNDQwLCJpc3MiOiJUYW5lciBTYXlkYW0iLCJhdWQiOiJUYW5lciBTYXlkYW0ifQ.WEjjF2ngsDKpkZHuFbyQ0jxXFRbGuAhADPLBUvTZisZUwFvqjiXMRAw8HU4DmBrcufBOMPphCj8qMPrY9HbjSA';

  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(cloneReq);
};
