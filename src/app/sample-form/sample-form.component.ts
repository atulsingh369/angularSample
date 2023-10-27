import { Component } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html',
  styleUrls: ['./sample-form.component.css'],
})
export class SampleFormComponent {
  invoiceNo = new FormControl('');

  constructor(private firestore: Firestore) {}

  saveData() {
    addDoc(collection(this.firestore, 'invoices'), {
      invoiceNo: this.invoiceNo.value,
    });
  }

  resetForm(): void {
    this.invoiceNo.setValue('');
  }

  handleSubmit(): void {
    console.log(this.invoiceNo.value);
    this.saveData();
    this.resetForm();
  }
}
