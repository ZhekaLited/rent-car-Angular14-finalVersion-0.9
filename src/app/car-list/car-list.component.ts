import {Component, NgZone, OnInit} from '@angular/core';
import {Cars} from "../_models";
import {first} from "rxjs";
import {CarService} from "../_service/car.service";
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {HttpClient} from "@angular/common/http";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CarListComponent implements OnInit {

  cars: Cars[] = [];
  status!: any;
  visible!: boolean;
  id!: any;
  car!: any;

  constructor(public carService: CarService, private translate: TranslateService,
              private http: HttpClient, private confirmationService: ConfirmationService,
              private messageService: MessageService, private route: Router, private ngZone: NgZone) {
    translate.setDefaultLang(Global.language);
    translate.use(Global.language);
  }


  ngOnInit() {
    this.carService.getAllCarsSort().pipe(first()).subscribe(cars => {
      this.cars = cars;
    });
    this.useLanguage(Global.language);
  }

  useLanguage(language: string): void {
    Global.language = language;
    window.localStorage.setItem('access_language', language);
    this.translate.use(Global.language);
  }

  updateDamage(id: bigint) {
    const usersFind = this.cars.find(x => x.id == id);
    if (usersFind != null) {
      if (usersFind.damage == null || usersFind.damage == '') {
        this.http.put(`http://localhost:8080/cars/damageCars?id=${id}`,
          {param: {id, status: true}})
          .subscribe(result => usersFind.damage = result.toString());

        setTimeout(() => {
          this.ngOnInit()
        }, 1 * 10);
      } else {
        usersFind.damage = "";
        this.http.put(`http://localhost:8080/cars/damageCarsNull?id=${id}`,
          {param: {id, status: false}}).subscribe();
      }
    }
  }

  deleteCars(id: bigint) {
    const carsFind = this.cars.find(x => x.id == id);
    if (carsFind != null) {
      this.http.delete(`http://localhost:8080/cars/remove?id=${id}`).subscribe(x => {
          let index: number = this.cars.indexOf(carsFind); //Поиск индекса в массиве для удаления !!!
          if (index >= 0) { //Если правильно все отработает то index > 0 если не найдет то он будет отритательный.
            // Иначе будет ошибка
            this.cars.splice(index, 1); //Удаление из массива отображается на экране (Метод splice) !!!!
          }
        }
      );
    }
  }

  getImageCars(id: bigint) {
    const carsFind = this.cars.find(x => x.id == id);
    this.http.get<Cars>(`http://localhost:8080/cars/getImage?id=${id}`).subscribe();
  }

  getImagesCars(id: bigint) {
    const carsFind = this.cars.find(x => x.id == id);
    this.http.get<Cars>(`http://localhost:8080/cars/getImages?id=${id}`).subscribe();
  }

  confirm2(id: bigint) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'Record deleted'});
        this.getImagesCars(id);
        this.getImageCars(id);
        this.deleteCars(id);
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
            break;
        }
      }
    });
  }
}
