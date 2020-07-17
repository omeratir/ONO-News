import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { HomeComponent } from './home/home.component';

import { AngularImageViewerModule } from 'angular-x-image-viewer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';

import { FilterPipeModule } from 'ngx-filter-pipe';

import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { CategoriesModule } from './category/categories.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularImageViewerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    AngularMaterialModule,
    PostsModule,
    FormsModule,
    FilterPipeModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    CommonModule,
    CategoriesModule,
    AgmCoreModule.forRoot(
      {
        // apiKey: '',
        // libraries: ['places']
      }
    )
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
