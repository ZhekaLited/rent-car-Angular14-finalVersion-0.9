import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {switchMap} from "rxjs";
import {CarService} from "../_service/car.service";
import {Users} from "../_models/users";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user!: Users;

  constructor(private route: Router, private translate: TranslateService,
              private router: ActivatedRoute, private carService: CarService) {
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }

  ngOnInit() {
    let id = this.router.snapshot.queryParamMap.get('userid');
    return this.carService.getUser(id).subscribe(t => {
        this.user = t;
      }
    );
    this.useLanguage(Global.language);
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  public clear() {
    localStorage.removeItem("access_token");
    this.route.navigateByUrl("/");
  }
}
