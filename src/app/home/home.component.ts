import {Component, OnInit} from '@angular/core';
import {Cars} from 'src/app/_models/cars';
import {CarService} from "../_service/car.service";
import {first, Observable, retry} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {Message, MessageService} from 'primeng/api';
import {AppComponent} from "../app.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  cars: Cars[] = [];
  responsiveOptions;
  messages!: Message[];


  constructor(private carService: CarService, private http: HttpClient,
              private translate: TranslateService, private messageService: MessageService,
              private appComponent: AppComponent
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }


  ngOnInit() {
    this.carService.getAll().pipe(first()).subscribe(cars => {
      this.cars = cars;
    });
    this.useLanguage(Global.language);
    this.show();
  }

  getByIdCars(id: bigint | null): Observable<Cars> {
    return this.http.get<Cars>(`http://localhost:8080/cars/carsById?id=${id}`)
      .pipe(retry(1));
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  show() {
    if (this.appComponent.showMessages)
      this.messages = [{ severity: 'success', summary: 'Successful', detail: 'Your application is under consideration' }];
  }
}
