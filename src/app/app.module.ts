import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
// import { MyserviceService } from './myservice.service';
// import { NewCmpComponent } from './new-cmp/new-cmp.component';
// import { ChangeTextDirective } from './change-text.directive';
// import { SqrtPipe } from './app.sqrt';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

export class formSubmit {
  constructor() {}
  handleSubmit(): void {
    alert('form is submited');
  }
}
