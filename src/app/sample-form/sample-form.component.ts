import { Component, OnInit, OnChanges } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html',
  styleUrls: ['./sample-form.component.css'],
})
export class SampleFormComponent implements OnInit, OnChanges {
  // Form Variables
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

  user: any;
  public loggedIn: boolean = false;
  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
    private auth: Auth
  ) {}

  invoicesData: any[] = [];
  updateData: any[] = [];
  add: boolean = false;
  update: boolean = false;
  del: boolean = false;
  gotData: boolean = false;
  log: boolean = false;
  regis: boolean = false;
  emailString: any = '';
  passwordString: any = '';

  //Auth forms and functions
  userEmails = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    cnfPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get email() {
    return this.userEmails.get('email');
  }

  get password() {
    return this.userEmails.get('password');
  }

  get cnfPassword() {
    return this.userEmails.get('password');
  }

  handleLogin(): void {
    console.log('login');
  }

  handleRegister(): void {
    //Register User
    if (
      this.userEmails.controls['email'].value &&
      this.userEmails.controls['password'].value
    ) {
      createUserWithEmailAndPassword(
        this.auth,
        this.userEmails.controls['email'].value,
        this.userEmails.controls['password'].value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user);
          this.regis = false;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorCode);
        });
    } else alert('Enter Details');
  }

  googleLogin(): void {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(
      async (credentials: UserCredential) => {
        this.user = credentials.user;
        alert(`Hello, ${this.user.displayName}`);
      }
    );
  }

  login(): void {
    this.log = true;
    this.del = false;
    this.update = false;
    this.update = false;
  }

  //FireStore
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
    deleteDoc(
      doc(this.firestore, `/invoices/invoiceNo - ${this.invoiceNo.value}`)
    )
      .then((data) => {
        this.toastr.success('Deleted Succesfully');
      })
      .catch((error) => {
        alert('No Data Found');
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

  getSingleDoc(): void {
    const docSnap = getDoc(
      doc(this.firestore, 'invoices', `invoiceNo - ${this.invoiceNo.value}`)
    ).then((doc) => {
      if (doc.exists()) {
        this.updateData.push(doc.data());
        console.log(this.updateData);
        this.gotData = true;
      } else {
        alert('No Data Found');
        this.resetForm();
        this.gotData = false;
        this.update = false;
      }
    });
  }

  handleSubmit(): void {
    this.saveData();
    this.resetForm();
    this.add = false;
    this.update = false;
    this.invoicesData = [];
    this.getInvoices();
    this.gotData = false;
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
