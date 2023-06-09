import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ButtonModule} from 'primeng/button';
import {CarouselModule} from 'primeng/carousel';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AddComponent} from './add/add.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChipModule} from 'primeng/chip';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {GalleriaModule} from 'primeng/galleria';
import { PaperworkComponent } from './paperwork/paperwork.component';
import { UserComponent } from './user/user.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { AddCarComponent } from './add-car/add-car.component';
import { FileUploadModule } from 'primeng/fileupload';
import { CarListComponent } from './car-list/car-list.component';
import { TagModule } from 'primeng/tag';
import { RegistrationComponent } from './registration/registration.component';



export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddComponent,
    AdminComponent,
    LoginComponent,
    PaperworkComponent,
    UserComponent,
    CreateAdminComponent,
    AddCarComponent,
    CarListComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    ToastModule,
    TableModule,
    TagModule,
    FileUploadModule,
    ConfirmDialogModule,
    InputTextModule,
    DialogModule,
    MessagesModule,
    GalleriaModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    CalendarModule,
    ButtonModule,
    HttpClientModule,
    TooltipModule,
    CarouselModule,
    ReactiveFormsModule,
    ChipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
