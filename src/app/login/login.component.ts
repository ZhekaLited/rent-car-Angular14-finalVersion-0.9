import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {EntityDetailsComponent} from "../_service/EntityDetailsComponent";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthenticationService} from "../_service/authentication.service";
import {AuthenticationRequestDto} from "../_models/AuthenticationRequestDto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends EntityDetailsComponent implements OnInit {
  errors = '';
  submittted = false;
  public hidePassword: boolean = true;

  @ViewChild("passwordInput", {static: false})
  private passwordInput!: ElementRef;

  constructor(private translate: TranslateService,
              route: ActivatedRoute, fb: FormBuilder,
              private authenticationService: AuthenticationService,
              router: Router,){
    super(route, fb, router);
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }

  public changePasswordVisibilityClickedHandler(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.hidePassword = !this.hidePassword;

    this.setCaretToPosition(this.passwordInput, this.passwordInput.nativeElement.value.length);
  }

  protected saveInternal() {
    const loginDTO: AuthenticationRequestDto = this.detailsForm.getRawValue();

    // this.appComponent.loginFromForm = this.detailsForm.value.login;
    // window.localStorage.setItem('access_login', this.appComponent.loginFromForm);

    this.authenticationService.login(this.detailsForm.getRawValue())
      .subscribe((token) => {
        if (token) {
          localStorage.setItem("access_token", token);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
          this.router.navigateByUrl(returnUrl);
        }
      //   errors: errors => {
      //     this.errors = errors;
      //   }
      });
  }

  get f() { return this.detailsForm.controls; }

  onSubmit() {
    this.submittted = true;

    // stop here if form is invalid
    if (this.detailsForm.invalid) {
      return;
    }
  }


  ngOnInit(): void {
    this.createForm();
    this.useLanguage(Global.language);

  }


  private createForm() {
    this.detailsForm = this.fb.group({
      login: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  //Язык смена
  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language); //Сохранение языка в localStorage
    this.translate.use(Global.language);
  }
}
