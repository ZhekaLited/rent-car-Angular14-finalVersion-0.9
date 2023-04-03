import {Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// import { environment } from '@environments/environment';
import { Users } from 'src/app/_models/users';
import { AuthenticationRequestDto } from 'src/app/_models/AuthenticationRequestDto';
import { Configuration } from './configuration';
import { BASE_PATH} from './variables';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  [x: string]: any;


  protected basePath = 'http://localhost:8080';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  private userSubject!: BehaviorSubject<Users | null>;


  constructor( router: Router, protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }

    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }

  }


  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   * Login
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public login(body?: AuthenticationRequestDto, observe?: 'body', reportProgress?: boolean): Observable<string>;
  public login(body?: AuthenticationRequestDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
  public login(body?: AuthenticationRequestDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
  public login(body?: AuthenticationRequestDto, observe?: 'responseType', reportProgress?: boolean): Observable<HttpResponse<string>>;
  public login(body?: AuthenticationRequestDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.accessToken) {
      const accessToken = typeof this.configuration.accessToken === 'function'
        ? this.configuration.accessToken()
        : this.configuration.accessToken;
      console.log(accessToken);
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }
    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'text/plain',
      'application/json',
      'text/json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json',
      'json/text',
      'application/_*+json'
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }
    return this.httpClient.request('post',`http://localhost:8080/api/v1/auth/login`,
      {
        body: body,
        responseType: 'text',
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      },
    );
  }
}
