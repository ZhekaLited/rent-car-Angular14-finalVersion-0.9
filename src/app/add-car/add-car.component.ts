import {Component, NgZone, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Global} from "../globals";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {CarService} from 'src/app/_service/car.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
  providers: [MessageService]
})
export class AddCarComponent implements OnInit {

  FormCars!: FormGroup;
  uploadedFiles: any[] = [];
  submitted = false;
  visible!: boolean;
  fileFat!: any;
  ImageCars!: FormGroup;
  filesFat!: any;

  constructor(private translate: TranslateService,
              public fb: FormBuilder, private ngZone: NgZone,
              private router: Router, private messageService: MessageService,
              private carService: CarService) {
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

  onUpload(event: any) {
    if (event.files) {
      this.fileFat = event.files[0].name;
      console.log(this.fileFat)
      this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
  }

  get f() {
    return this.FormCars.controls;
  }

  addIssue() {
    this.FormCars = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      price: ['', Validators.pattern('^[ 0-9]+$')],
      release: ['', Validators.pattern('^[ 0-9]+$')],
      kpp: ['', Validators.required],
      dvigatel: ['', Validators.required],
      mesta: ['', Validators.required],
      image: [this.fileFat]
    });
  }

  onUploads(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.filesFat = file.name;
      console.log(this.filesFat)
    }
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  visibleButton(event: any) {
    if (event != null) {
      return true;
    } else {
      return false;
    }
  }

  showDialog() {
    this.submitted = true;
    if (this.FormCars.invalid) {
      return;
    } else {
      this.visible = true;
    }
  }

  submitForm() {
    if (this.fileFat == null) {
      return;
    } else {
      this.FormCars.patchValue({ // this.FormCars.patchValue Нужен для присвоению полю значение (Если не подставляется!!!)
        image: this.fileFat,
      })
      this.carService.CreateCar(this.FormCars.value).subscribe((res) => {
        console.log('Issue added!');
        this.ngZone.run(() => this.router.navigateByUrl('/admin'));
      });
    }
  }
}
