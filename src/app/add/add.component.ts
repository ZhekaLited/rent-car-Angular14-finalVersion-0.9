import {Component, NgZone, OnInit} from '@angular/core';
import {Cars} from "../_models";
import {switchMap} from "rxjs";
import {CarService} from "../_service/car.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Users} from "../_models/users";
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {AppComponent} from "src/app/app.component";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [MessageService]
})
export class AddComponent implements OnInit {
  cars: Cars[] = [];
  carsForm!: FormGroup;
  car!: Cars;
  users!: Users;
  condition: boolean = false;
  value!: Date;
  submitted = false;

  constructor(private carService: CarService, private primengConfig: PrimeNGConfig, private ngZone: NgZone,
              private http: HttpClient, public fb: FormBuilder, private router: ActivatedRoute, private route: Router,
              private translate: TranslateService, private appComponent: AppComponent,) {

    translate.setDefaultLang(Global.language);
    translate.use(Global.language);

  }

  addIssue() {
    var id = this.router.snapshot.paramMap.get('id');
    this.carService.getByIdCars(id).subscribe((car) => {
      this.carsForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        birthday: ['', Validators.required],
        passid: ['', Validators.required],
        balance: ['', Validators.min(car.price)],
        timearent: ['', Validators.required],
        carsid: [car.id],
      })
    })
  }

  get f() {
    return this.carsForm.controls;
  }

  submitForm() {
    this.submitted = true;
    if (this.carsForm.invalid) {
      return;
    } else {
      this.carService.CreateBug(this.carsForm.value).subscribe((res) => {
        console.log('Issue added!');
        this.ngZone.run(() => this.route.navigateByUrl('/'));
      });
    }
  }

  //Достать с Json Id и достать нужное поле
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.addIssue();
    this.router.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.carService.getOrder(params.get('id')!))
    ).subscribe(t => {
        this.car = t
      },
    );
    this.useLanguage(Global.language);
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  show() {
    if (this.carsForm.invalid || '' || null) {
      this.appComponent.showMessages = false;
    }else {
    this.appComponent.showMessages = true;
    }
  }
}
