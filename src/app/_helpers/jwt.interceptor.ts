import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem("access_token");
    if (token) {
      const cloneReq = request.clone({
        headers: request.headers.set(
          "Authorization",
          "Bearer " + token
        ),
      });

      return next.handle(cloneReq).pipe(
        tap(
          (succ) => {},
          (err) => {
            if (err.status == 401 || err.status == 403) {
              localStorage.removeItem("access_token");
              this.router.navigateByUrl("/login");
            }
          }
        )
      );
    } else return next.handle(request.clone());
  }
}
