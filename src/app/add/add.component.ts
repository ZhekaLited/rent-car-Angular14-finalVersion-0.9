import {Component, NgZone, OnInit} from '@angular/core';
import {Cars} from "../_models";
import {Observable, switchMap} from "rxjs";
import {CarService} from "../_service/car.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Users} from "../_models/users";
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {AppComponent} from "src/app/app.component";
import {ItemImage} from "src/app/_models/itemImage";

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
  images!: ItemImage[];

  responsiveOptions!: any[];

  constructor(private carService: CarService, private primengConfig: PrimeNGConfig, private ngZone: NgZone,
              private http: HttpClient, public fb: FormBuilder, private router: ActivatedRoute, private route: Router,
              private translate: TranslateService, private appComponent: AppComponent) {

    translate.setDefaultLang(Global.language);
    translate.use(Global.language);

  }

  //Достать с Json Id и достать нужное поле
  ngOnInit() {
    this.images = new Array<ItemImage>(); //Обьявление колекции
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
    this.primengConfig.ripple = true;

    this.router.paramMap.pipe(
      switchMap((params: ParamMap) => {
        let id = params.get('id')!;
        this.getByIdCarsImages(id);
        return this.carService.getOrder(id);
      })
    ).subscribe(t => {
        this.car = t;
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
    } else {
      this.appComponent.showMessages = true;
    }
  }

  getByIdCarsImages(id: string) { //Обрабатывание в пути фото Галлерии
    return this.http.get<string[]>(`http://localhost:8080/cars/images?id=${id}`).subscribe(prm => {
        if (prm != null) {
          for (let i = 0; i < prm.length; i++) {
            let item: ItemImage;
            item = new ItemImage(`assets/images/${prm[i]}`,
              `assets/images/s${prm[i]}`, "", "title");
            this.images.push(item);
          }
        }
      }
    )
  }
}
