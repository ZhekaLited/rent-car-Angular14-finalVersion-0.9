import {Component, NgZone, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {CarService} from "../_service/car.service";
import {ActivatedRoute, Router} from "@angular/router";
import {equals} from "@ngx-translate/core/lib/util";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  Form!: FormGroup;
  submitted = false;
  iduser!: any;
  ROLE!: any;
  id!: any;
  carid!: any;
  confirm!: any;
  password!: any;
  boolConfirm!: boolean;


  constructor(private translate: TranslateService, public fb: FormBuilder, private http: HttpClient,
              private carService: CarService, private ngZone: NgZone, private route: ActivatedRoute,
              private router: Router) {
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }


  ngOnInit(): void {
    let idcar = this.route.snapshot.queryParamMap.get('carid');
    this.carid = idcar;
    this.addIssue();
    this.useLanguage(Global.language);
  }

  addIssue() {
    this.Form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      equalsPassword: ['', Validators.required]
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
    this.confirm = this.Form.getRawValue()['equalsPassword'];
    this.password = this.Form.getRawValue()['password']; //Получение значение из FormGroup [Type String]
    if (this.confirm == this.password) {
      this.boolConfirm = true;
      this.isExistsUserCheck(this.Form.value);
    } else {
      this.boolConfirm = false;
      this.ROLE = "";
    }
  }

  getRoleByLoginPassword(body: string) {
    this.http.post<string>('http://localhost:8080/cars/getUser',
      body).subscribe(res => {
      let string = JSON.stringify(res); //Запарсить. Делается потому что обьект не парсится
      this.iduser = JSON.parse(string).id;
      if (this.carid == null) {
        this.ngZone.run(() => this.router.navigate(['/'], {queryParams: {userid: this.iduser}})); //Таким образом отправляет id на другой компонент
      } else {
        this.ngZone.run(() => this.router.navigate(['/paperwork/' + this.carid], {queryParams: {userid: this.iduser}})); //Таким образом отправляет id на другой компонент
      }
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
      }
    })
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language); //Сохранение языка в localStorage
    this.translate.use(Global.language);
  }
}
