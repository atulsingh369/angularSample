import { Component, OnInit, OnChanges } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html',
  styleUrls: ['./sample-form.component.css'],
})
export class SampleFormComponent implements OnInit, OnChanges {
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

  constructor(private firestore: Firestore, private toastr: ToastrService) {}

  invoicesData: any[] = [];
  add: boolean = false;
  update: boolean = false;
  del: boolean = false;

  public ngOnInit(): void {
    this.getInvoices();
  }

  public ngOnChanges(): void {
    this.getInvoices();
  }

  saveData(): void {
    setDoc(
      doc(this.firestore, 'invoices', `invoiceNo - ${this.invoiceNo.value}`),
      {
        vehicleNo: this.vehicleNo.value,
        wsCode: this.wsCode.value,
        wsName: this.wsName.value,
        wsTown: this.wsTown.value,
        distance: this.distance.value,
        KOT: this.KOT.value,
        mlrNo: this.mlrNo.value,
        labour: this.labour.value,
        deiselVoucherNo: this.deiselVoucherNo.value,
        deiselAmt: this.deiselAmt.value,
        Khuraki: this.Khuraki.value,
        frieght: this.frieght.value,
        toll: this.toll.value,
        repairs: this.repairs.value,
        cashExp: this.cashExp.value,
        invoiceAckn: this.invoiceAckn.value,
        mlrAckn: this.mlrAckn.value,
      }
    );
  }

  delData(): void {
    console.log(this.invoiceNo);
    deleteDoc(
      doc(this.firestore, `/invoices/invoiceNo - ${this.invoiceNo.value}`)
    )
      .then((data) => {
        this.toastr.success('Deleted Succesfully');
      })
      .catch((error) => {
        this.toastr.error(error);
      });
  }

  getInvoices() {
    const data = getDocs(collection(this.firestore, 'invoices'));
    data.then((invoices) => {
      invoices.docs.map((invoice) => {
        this.invoicesData.push({ id: invoice.id, ...invoice.data() });
      });
    });
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

  getDoc(): void {
    updateDoc(doc(this.firestore, `/invoices/invoiceNo - ${this.invoiceNo}`), {
      name: 'Updated name is rick roll',
    })
      .then((data) => {
        console.log('Doc updated');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleUpdate(): void {
    this.resetForm();
    this.update = false;
    this.invoicesData = [];
    this.getInvoices();
  }

  handleSubmit(): void {
    this.saveData();
    this.resetForm();
    this.add = false;
    this.invoicesData = [];
    this.getInvoices();
    this.toastr.success('Created Succesfully');
  }

  handleDelete(): void {
    this.delData();
    this.resetForm();
    this.del = false;
    this.invoicesData = [];
    this.getInvoices();
  }

  create(): void {
    this.add = true;
    this.update = false;
    this.del = false;
  }

  upd(): void {
    this.update = true;
    this.add = false;
    this.del = false;
  }

  delt(): void {
    this.del = true;
    this.update = false;
    this.update = false;
  }
}
