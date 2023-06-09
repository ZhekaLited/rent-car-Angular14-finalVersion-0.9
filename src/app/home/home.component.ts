import {Component, NgZone, OnInit} from '@angular/core';
import {Cars} from 'src/app/_models/cars';
import {CarService} from "../_service/car.service";
import {first, map, Observable, retry, switchMap} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {Message, MessageService} from 'primeng/api';
import {AppComponent} from "../app.component";
import {Users} from "../_models/users";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Admin} from "../_models/admin";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  cars: Cars[] = [];
  responsiveOptions;
  messages!: Message[];
  visible!: boolean;
  users: Users[] = [];
  id!: any;
  Form!: FormGroup;
  submitted = false;
  admin: Admin[] = [];
  iduser!: any;
  login!: any;
  ROLE!: any;
  userid!: any;
  userLogin!: any;
  idCars!: any;

  constructor(private carService: CarService, private http: HttpClient,
              private translate: TranslateService, private messageService: MessageService,
              private appComponent: AppComponent, public fb: FormBuilder, private ngZone: NgZone,
              private router: Router, private route: ActivatedRoute
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }


  ngOnInit() {
    let userid = this.route.snapshot.queryParamMap.get('userid');
    this.userid = userid;
    if (this.userid != null) {
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          let id = this.route.snapshot.queryParamMap.get('userid')!;
          return this.carService.getUserForLogin(id);
        })
      ).subscribe(t => {
          this.userLogin = t;
        },
      );
    }
    this.addIssue();
    this.carService.getAll().pipe(first()).subscribe(cars => {
      this.cars = cars;
    });
    this.useLanguage(Global.language);
    this.show();
  }

  addIssue() {
    this.Form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.Form.controls;
  }

  submit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
    this.isExistsUserCheck(this.Form.value);
  }

  getByIdCars(id: bigint | null): Observable<Cars> {
    return this.http.get<Cars>(`http://localhost:8080/cars/carsById?id=${id}`)
      .pipe(retry(1));
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  show() {
    if (this.appComponent.showMessages)
      this.messages = [{severity: 'success', summary: 'Successful', detail: 'Your application is under consideration'}];
  }

  notShow() {
    this.appComponent.showMessages = false;
  }

  register(id: any) {
    if (this.userid != null) {
      this.router.navigate(['/register/' + id], {queryParams: {userid: this.userid}});
    } else {
      this.router.navigate(['/register/' + id]);
    }
    this.appComponent.showMessages = false;
  }

  showDialog(id: any) {
    let userFind = this.cars.find(y => y.id == id);
    this.idCars = id;
    if (userFind != null) {
      if (this.userid != null) {
        this.visible = false;
        this.router.navigate(['/paperwork/' + id], {queryParams: {userid: this.userid}});
      } else {
        this.visible = true;
      }
    }
  }

  getRoleByLoginPassword(body: string) {
    this.http.post<string>('http://localhost:8080/cars/getUser',
      body).subscribe(res => {
      let string = JSON.stringify(res); //Запарсить. Делается потому что обьект не парсится
      this.iduser = JSON.parse(string).id;
      this.ngZone.run(() => this.router.navigate(['/paperwork/' + this.id], {queryParams: {userid: this.iduser}})); //Таким образом отправляет id на другой компонент
    })
  }

  isExistsUserCheck(body: string) {
    this.http.post<string>('http://localhost:8080/cars/getUser',
      body).subscribe(res => {
      if (res == null) {
        this.carService.CreateAccount(this.Form.value).subscribe((res) => {
          console.log('Issue added!');
          this.getRoleByLoginPassword(this.Form.value)
        });
      }
      if (res != null) {
        let string = JSON.stringify(res); //Запарсить. Делается потому что обьект не парсится
        this.iduser = JSON.parse(string).id;
        this.ROLE = JSON.parse(string).role;
        if (this.ROLE == "USER") {
          this.ngZone.run(() => this.router.navigate(['/paperwork/' + this.id], {queryParams: {userid: this.iduser}})); //Таким образом отправляет id на другой компонент
        }
      }
    })
  }

  public clear() {
    localStorage.removeItem("access_token");
    this.router.navigateByUrl("/");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //Перезагрузка страницы без обновления страницы!!!
    this.appComponent.showMessages = false;
  }

  myOrder() {
    if(this.userid != null) {
    this.router.navigate(['/orderList'], {queryParams: {userid: this.userid}});
    this.appComponent.showMessages = false;
    }
  }

  nextLogin() {
    if (this.idCars != null) {
      this.router.navigate(['/login/'],{queryParams: {carid: this.idCars}});
    }
  }

  nextRegistration() {
    if(this.idCars != null) {
      this.router.navigate(['/registation'], {queryParams: {carid: this.idCars}});
    }
  }
}
