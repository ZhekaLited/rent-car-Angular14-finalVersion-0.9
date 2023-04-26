import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Cars} from "../_models/cars";
import {map, Observable, retry} from "rxjs";
import {Users} from "../_models/users";
import {Admin} from "../_models/admin";
import { AuthenticationService } from 'src/app/_service/authentication.service';

@Injectable({providedIn: 'root'})

export class CarService {
  allowedRoles:any;

  constructor(private http: HttpClient,private router: Router) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAll() {
    return this.http.get<Cars[]>('http://localhost:8080/cars/allCars');
  }

  getAllUsers() {
    return this.http.get<Users[]>('http://localhost:8080/cars/allUsers')
  }

  getByIdCars(id: string | null): Observable<Cars> {
    return this.http
      .get<Cars>(`http://localhost:8080/cars/carsById?id=${id}`)
      .pipe(retry(1));
  }

  //Обратиться к бэку за айдишником
  getOrder(id: string) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', "applicaton/json");
    return this.http.get<Cars>(`http://localhost:8080/cars/carsById?id=${id}`,
      {headers: headers}).pipe(map((response: any) => response));
  }

  CreateBug(data: any): Observable<Users> {
    return this.http
      .post<Users>('http://localhost:8080/cars/add',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1));
  }


  CreateAccount(data: any): Observable<Admin> {
    return this.http
      .post<Admin>('http://localhost:8080/cars/addAcount',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1));
  }

  CreateAdmin(data: any): Observable<Admin> {
    return this.http
      .post<Admin>('http://localhost:8080/cars/addAdmin',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1));
  }

  getUser(userid: any) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', "applicaton/json");
    return this.http.get<Users>(`http://localhost:8080/cars/getIdUser?userid=${userid}`,
      {headers: headers}).pipe(map((response: any) => response));
  }

  invalid(data: any): Observable<Admin> {
    return this.http
      .post<Admin>('http://localhost:8080/cars/valid',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1));
  }
}
