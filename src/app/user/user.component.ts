import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {CarService} from "../_service/car.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user!: any;
  userid!:any;

  constructor(private route: Router, private translate: TranslateService,
              private router: ActivatedRoute, private carService: CarService) {
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }

  ngOnInit() {
    let id = this.router.snapshot.queryParamMap.get('userid');
    this.userid = id;
    return this.carService.getUser(id).subscribe(t => {
        for (let nameUser of t) {
          this.user = t;
        }
      }
    );
    this.useLanguage(Global.language);
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  home() {
    this.route.navigate(['/'],{queryParams: {userid: this.userid}});
  }
}
