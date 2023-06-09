import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Users} from "../_models/users";
import {catchError, first, Observable, retry, Subject} from "rxjs";
import {CarService} from "../_service/car.service";
import {Cars} from '../_models';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ConfirmationService, Message, PrimeNGConfig, SortEvent} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {Global} from "../globals";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [ConfirmationService]

})
export class AdminComponent implements OnInit {

  users: Users[] = [];
  cars: Cars[] = [];
  messages: Message[] = [];
  value!: boolean;
  visible!: boolean;
  usersForm!: FormGroup;
  submitted = false;
  id!: any;
  deviations!: any;
  balance!: any;
  price!: any;
  user!: Users;
  count!: any;
  isLoading!: boolean;

  constructor(private carService: CarService, private http: HttpClient,
              private cd: ChangeDetectorRef,
              private ConfirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, private ngZone: NgZone,
              public fb: FormBuilder, private router: ActivatedRoute, private route: Router,
              private translate: TranslateService) {
    this.value = false;
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  ngOnInit() {
    this.updateIssue();
    this.carService.getCountUsers().subscribe(count => {
      this.count = count;
    })
    this.carService.getAll().pipe(first()).subscribe(cars => {
      this.cars = cars;
    });
    this.useLanguage(Global.language);
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  updateIssue() {
    this.usersForm = this.fb.group({
      deviations: [''],
    })
  }

  closeTab() {
    this.visible = false;
  }

  submitForm() {
    if (this.usersForm.value != null || this.usersForm.value != "") {
      this.updatedeviations(this.id, this.usersForm.value);
      setTimeout(() => {
        this.ngOnInit()
      }, 1 * 10); //Установка времени для перезагрузки компонентов
    }
    //Обновляет страницу без перезагрузки.
  }

  showDialog(id: any) {
    let userFind = this.users.find(y => y.id == id);
    if (userFind != null && (userFind.disbalance == null || userFind.disbalance == false)) {
      if (id != null || "") {
        this.visible = true;
        return this.id = id;
      } else {
        this.visible = false;
      }
    }
  }

  values(deviations: any) {
    this.deviations = deviations;
    if (deviations != null || '') {
      return this.value = true;
    } else {
      return this.value = false;
    }
  }

  updateDamage(id: bigint) {
    const usersFind = this.users.find(x => x.id == id);
    if (usersFind != null) {
      if (usersFind.damage == null || usersFind.damage == '') {
        this.http.put(`http://localhost:8080/cars/damage?id=${id}`, id)
          .subscribe(
            result => {
              usersFind.damage = JSON.parse(JSON.stringify(result)).image
            });
      } else {
        this.http.put(`http://localhost:8080/cars/damageNull?id=${id}`, id).subscribe(
          result => {
            usersFind.damage = JSON.parse(JSON.stringify(result)).image
          }
        );
      }
    }
  }

  updatedeviations(id: bigint, deviations: any) {
    let userFind = this.users.find(y => y.id == id);
    if (userFind != null && (userFind.disbalance == null || userFind.disbalance == false)) {
      this.http.put(`http://localhost:8080/cars/Reason?id=${id}`,
        {param: {disbalance: true, deviations: deviations}}).subscribe();
    }
  }

  updateBalance(id: any, balance: bigint, price: any) {
    let userFind = this.users.find(y => y.id == id);
    if (userFind != null && (userFind.disbalance == null || userFind.disbalance == false)) {

      this.http.put<any>(`http://localhost:8080/cars/balance?id=${id}`,
        {param: {disbalance: true, balance: balance, price: price}}) //Передача параметров put метода!!!
        .subscribe(balance => { //
          if (userFind != null) { //
            userFind.balance = balance; //Отключение кнопки
            userFind.disbalance = true; //
          }
        });
    }
  }


  //-----methods PAGINATION AND SORTING WITH REST API-----
  loadPatientListing(event: any) {
    this.isLoading = true; //Загрузка
    this.carService.getAllUsers(event.first, event.rows, event.sortOrder== 1 ? "ASC"  : "DESC",event.sortField == undefined ? "id" : event.sortField).pipe(first()).subscribe(users => {
      this.users = users;
      this.isLoading = false; //Загрузка
    },
      (error) => {        //Кружок загрузки
      this.isLoading = false;  //Загрузка
      }
    )
  }


  public clear() {
    localStorage.removeItem("access_token");
    this.route.navigateByUrl("/");
  }
}








//------PAGINATION AND SORTING EXAMPLE-----

// this.patientFilterModel.PageSize = event.rows;
// this.patientFilterModel.RowNumber = event.first;
// this.patientFilterModel.OrderColomn = event.sortField;
//
// if (event.sortOrder == -1 || this.desc == "DESC") {
//   this.desc = "ASC";
// } else if(event.sortOrder == 1 || this.desc == "ASC"){
//   this.desc = "DESC";
// }

// this.patientService.GetPatientListing(this.patientFilterModel).subscribe(
//   (data) => {
//     this.patientModel = data;
//     this.paitientListing = this.patientModel._ListPatientListing;
//     this.totalRecords = data.TotalRecords;
//   },
//   (error) => {
//     this.loading = false;
//   },
// );
