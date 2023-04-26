import {Component, NgZone, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CarService} from "../_service/car.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {

  Form!: FormGroup;
  submitted = false;

  constructor( private translate: TranslateService,private carService: CarService,
               public fb: FormBuilder,private ngZone: NgZone,
               private router: Router) {
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }

  ngOnInit() {
    this.addIssue();
    this.useLanguage(Global.language);
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  addIssue() {
    this.Form = this.fb.group({
      login: ['',Validators.required],
      password: ['',Validators.required],
    });
  }

  get f() {
    return this.Form.controls;
  }

  submit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    } else {
      this.carService.CreateAdmin(this.Form.value).subscribe((res) => {
        console.log('Issue added!');
        this.ngZone.run(() => this.router.navigateByUrl('/admin'));
      });
    }
  }
}
