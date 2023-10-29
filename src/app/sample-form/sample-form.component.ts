import { Component } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc,
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
  vehicleNo = new FormControl('');
  wsCode = new FormControl('');
  wsName = new FormControl('');
  wsTown = new FormControl('');
  distance = new FormControl('');
  KOT = new FormControl('');
  mlrNo = new FormControl('');
  labour = new FormControl('');
  deiselVoucherNo = new FormControl('');
  deiselAmt = new FormControl('');
  Khuraki = new FormControl('');
  frieght = new FormControl('');
  toll = new FormControl('');
  repairs = new FormControl('');
  cashExp = new FormControl('');
  invoiceAckn = new FormControl('');
  mlrAckn = new FormControl('');

  constructor(private firestore: Firestore) {}
  myData: any[] = [];

  saveData() {
    setDoc(
      doc(
        this.firestore,
        `invoiceNo - ${this.invoiceNo.value}`,
        'customerDetails'
      ),
      {
        vehicleNo: this.vehicleNo.value,
        wsCode: this.wsCode.value,
        wsName: this.wsName.value,
        wsTown: this.wsTown.value,
        distance: this.distance.value,
      }
    );
    setDoc(
      doc(
        this.firestore,
        `invoiceNo - ${this.invoiceNo.value}`,
        'shipmentDetails'
      ),
      {
        KOT: this.KOT.value,
        mlrNo: this.mlrNo.value,
        labour: this.labour.value,
        deiselVoucherNo: this.deiselVoucherNo.value,
        deiselAmt: this.deiselAmt.value,
      }
    );
    setDoc(
      doc(this.firestore, `invoiceNo - ${this.invoiceNo.value}`, 'cashExpense'),
      {
        Khuraki: this.Khuraki.value,
        frieght: this.frieght.value,
        toll: this.toll.value,
        repairs: this.repairs.value,
      }
    );
    setDoc(
      doc(
        this.firestore,
        `invoiceNo - ${this.invoiceNo.value}`,
        'postDelivery'
      ),
      {
        cashExp: this.cashExp.value,
        invoiceAckn: this.invoiceAckn.value,
        mlrAckn: this.mlrAckn.value,
      }
    );
  }

  readData() {
    return getDocs(collection(this.firestore, 'invoices'));
  }

  resetForm(): void {
    this.invoiceNo.setValue('');
    this.vehicleNo.setValue('');
    this.wsCode.setValue('');
    this.wsName.setValue('');
    this.wsTown.setValue('');
    this.distance.setValue('');
    this.KOT.setValue('');
    this.mlrNo.setValue('');
    this.labour.setValue('');
    this.deiselVoucherNo.setValue('');
    this.deiselAmt.setValue('');
    this.Khuraki.setValue('');
    this.frieght.setValue('');
    this.toll.setValue('');
    this.repairs.setValue('');
    this.cashExp.setValue('');
    this.invoiceAckn.setValue('');
    this.mlrAckn.setValue('');
  }

  handleUpdate(): void {
    this.myData.push(this.readData());
    console.log(this.myData);
    console.log('object');
  }

  handleSubmit(): void {
    this.saveData();
    this.resetForm();
  }
}
