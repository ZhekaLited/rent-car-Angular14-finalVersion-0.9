import {Component, NgZone, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {Cars} from "../_models";
import {switchMap} from "rxjs";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {CarService} from "../_service/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "../app.component";
import {MessageService} from "primeng/api";
import {Admin} from "../_models/admin";
import {HomeComponent} from "src/app/home/home.component";
import {Users} from "../_models/users";

@Component({
  selector: 'app-paperwork',
  templateUrl: './paperwork.component.html',
  styleUrls: ['./paperwork.component.scss'],
  providers: [MessageService, HomeComponent]

})
export class PaperworkComponent implements OnInit {
  car!: Cars;
  cars: Cars[] = [];
  carsForm!: FormGroup;
  submitted = false;
  admin: Admin[] = [];
  sub!: any;
  users!: Users;
  userid!: any;

  constructor(private translate: TranslateService, private router: ActivatedRoute, private carService: CarService,
              public fb: FormBuilder, private route: Router, private ngZone: NgZone, private appComponent: AppComponent,
              private homeComponent: HomeComponent) {
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }

  ngOnInit() {
    this.addIssue();
    let userid = this.router.snapshot.queryParamMap.get('userid');
    this.userid = userid;
    this.useLanguage(Global.language);
    this.router.paramMap.pipe(
      switchMap((params: ParamMap) => {
        let id = params.get('id')!;
        return this.carService.getOrder(id);
      })
    ).subscribe(t => {
        this.car = t;
      },
    );
  }

  addIssue() {
    var id = this.router.snapshot.paramMap.get('id');
    this.carService.getByIdCars(id).subscribe((car) => {
      this.carsForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        birthday: ['', Validators.required],
        passid: ['', Validators.pattern("^(?=\\d*[a-zA-Z])(?=\\D*\\d)[a-zA-Z0-9]+$")],
        balance: ['', Validators.min(car.price)],
        timearent: ['', Validators.required],
        carsid: [car.id],
        userid: [this.router.snapshot.queryParamMap.get('userid')] //Таким образом принмает значения с url поля к примеру id
      })
    })

    var idd = this.router.snapshot.queryParamMap.get('userid')!;
    this.carService.getUserForForm(idd).subscribe((users) => {
      this.carsForm = this.fb.group({
        name: [users.name],
        surname: [users.surname],
        birthday: [users.birthday],
        passid: [users.passid],
        balance: [users.balance],
        timearent: [users.timearent],
        carsid: [this.router.snapshot.paramMap.get('id')],
        userid: [this.router.snapshot.queryParamMap.get('userid')]
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
        this.route.navigate(['/'],{queryParams: {userid: this.userid}});
        // this.ngZone.run(() => this.route.navigateByUrl('/'));
      });
    }
  }


  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  home() {
    this.route.navigate(['/'],{queryParams: {userid: this.userid}});
  }

  show() {
    if (this.carsForm != null) {
      this.appComponent.showMessages = true;
    } else if (this.carsForm == null) {
      this.appComponent.showMessages = false;
    }
    // this.route.navigate(['/'],{queryParams: {userid: this.userid}});
  }
}
