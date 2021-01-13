import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { finalize, tap, switchMap } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    constructor(
        public loadingController: LoadingController
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url.indexOf('http') !== 0) {
            return next.handle(request);
        }

        return from(this.loadingController.create())
            .pipe(
                tap((loading) => {
                    return loading.present();
                }),
                switchMap((loading) => {
                    return next.handle(request).pipe(
                        finalize(() => {
                            loading.dismiss();
                        })
                    );
                })
            );
    }
}