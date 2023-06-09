import { Component, OnInit } from '@angular/core';
import {Global} from "./globals";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showMessages!: boolean;
  lang!: string;

  constructor(private translate: TranslateService) {
    this.showMessages = false;
  }

  //Условие для получение сохранненого языка из localStorage и чтение его на странице
  ngOnInit() {
    this.lang = window.localStorage.getItem('access_language') as string; //Получение языка
    if(this.lang == null || this.lang == '') { //Если переменная lang пуста или null
    this.translate.use('en');//То делаем стандарт en языка
    }else{
      this.translate.use(this.lang); //Если мы переменная не null то получаем язык из ппеременной lang
      Global.language = this.lang;
    }
  }
}
