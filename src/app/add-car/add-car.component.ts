import {Component, NgZone, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {

  FormCars!: FormGroup;
  submitted = false;

  constructor(private translate: TranslateService,
              public fb: FormBuilder,private ngZone: NgZone,
              private router: Router) {
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }

  ngOnInit() {
    this.useLanguage(Global.language);
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  addIssue() {
    this.FormCars = this.fb.group({
      login: ['',Validators.required],
      password: ['',Validators.required],
    });
  }

}
