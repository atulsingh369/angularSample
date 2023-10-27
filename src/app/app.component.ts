import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angularSample';
  @ViewChild('formData') sampleForm: any;
  firestore: Firestore = inject(Firestore);

  saveData(): void {
    addDoc(collection(this.firestore, 'invoices'), {	
      invoiceNo: this.sampleForm.value.invoiceNo,
    });
  }

  resetForm(): void {
    this.sampleForm.reset({
      invoiceNo: '',
    });
  }

  handleSubmit(): void {
    console.log(this.sampleForm.value.invoiceNo);
    this.saveData();
    this.resetForm();
  }
}
