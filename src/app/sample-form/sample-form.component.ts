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
import { read, utils, writeFile } from 'xlsx';
import {
  Auth,
  updatePassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut,
  UserCredential,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import { InvoiceData } from './sample-form.interface';

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
  resPass = new FormControl('');

  user: any;
  public loggedIn: boolean = false;
  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
    private auth: Auth,
    private authenticationService: AuthenticationService
  ) {}

  invoicesData: any[] = [];
  updateData: InvoiceData = {
    billingDate: '',
    soldToParty: 0,
    customerName: '',
    billingDoc: '',
    invoiceNo: '',
    gstInvoiceNo: '',
    KOT: 0,
    totalInvoiceAmt: 0,
    salesShipmentDiff: 0,
    shipmentNo: 0,
    mlrNo: 0,
    frieght: 0,
    shipmentCostDate: '',
    transporterName: '',
    serviceAgent: '',
    ownership: 'ATTACHED',
    vehicleNo: '',
    wsCode: '',
    wsName: '',
    wsTown: '',
    distance: '',
    labour: '',
    deiselVoucherNo: '',
    deiselAmt: '',
    Khuraki: '',
    toll: '',
    repairs: '',
    userDisplayName: '',
    userEmail: '',
  };
  invoiceId: any = '';
  add: boolean = false;
  update: boolean = false;
  del: boolean = false;
  gotData: boolean = false;
  log: boolean = false;
  regis: boolean = false;
  isResPass: boolean = false;
  public showPassword: boolean = false;

  public ngOnInit(): void {
    this.getInvoices();
    this.getAuthData();
  }

  public ngOnChanges(): void {
    this.getInvoices();
    this.getAuthData();
  }

  //Auth forms and functions
  userEmails = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(12)]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
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

  get name() {
    return this.userEmails.get('name');
  }

  handleLogin(): void {
    if (
      this.userEmails.controls['email'].value &&
      this.userEmails.controls['password'].value
    ) {
      //Login User
      signInWithEmailAndPassword(
        this.auth,
        this.userEmails.controls['email'].value,
        this.userEmails.controls['password'].value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          localStorage.setItem('userData', JSON.stringify(user));
          this.getAuthData();

          this.userEmails.reset();
          this.userEmails.controls['name'].setErrors(null);
          this.userEmails.controls['email'].setErrors(null);
          this.userEmails.controls['password'].setErrors(null);
          this.log = false;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorCode);
          this.userEmails.reset();
          this.userEmails.controls['name'].setErrors(null);
          this.userEmails.controls['email'].setErrors(null);
          this.userEmails.controls['password'].setErrors(null);
        });
    } else alert('Enter Details');
  }

  handleRegister(): void {
    if (
      this.userEmails.controls['email'].value &&
      this.userEmails.controls['password'].value
    ) {
      //Register User
      createUserWithEmailAndPassword(
        this.auth,
        this.userEmails.controls['email'].value,
        this.userEmails.controls['password'].value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: this.userEmails.controls['name'].value,
          });

          setDoc(doc(this.firestore, 'users', `${user.uid}`), {
            displayName: this.userEmails.controls['name'].value,
            email: this.userEmails.controls['email'].value,
          });

          this.userEmails.reset();
          this.userEmails.controls['name'].setErrors(null);
          this.userEmails.controls['email'].setErrors(null);
          this.userEmails.controls['password'].setErrors(null);
          alert('User registered');
          this.regis = false;
        })
        .catch((error) => {
          const errorCode = error.code;
          alert(errorCode);
        });
    } else alert('Enter Details');
  }

  googleLogin(): void {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(
      async (credentials: UserCredential) => {
        this.user = credentials.user;
        this.log = false;
        setDoc(doc(this.firestore, 'users', `${this.user.uid}`), {
          displayName: this.user.displayName,
          email: this.user.email,
        });
      }
    );
  }

  login(): void {
    this.log = true;
    this.del = false;
    this.update = false;
    this.update = false;
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem('userData');
        alert('Logged Out');
        this.getAuthData();
      })
      .catch((error) => {
        console.log(error);
      });
    this.getInvoices();
  }

  getAuthData(): void {
    this.user = this.authenticationService.currentUser;
    if (window.localStorage.getItem('userData')) {
      const authData: any = window.localStorage.getItem('userData');
      this.user = JSON.parse(authData);
    }
  }

  resetPass(): void {
    if (this.authenticationService.currentUser) {
      if (this.resPass.value) {
        updatePassword(
          this.authenticationService.currentUser,
          this.resPass.value
        )
          .then(() => {
            alert('Password has changed');
          })
          .catch((error) => {
            console.log(error);
            alert('Password not changed');
          });
        this.isResPass = false;
        this.resPass.reset('');
      } else {
        alert('Enter Details');
      }
    } else alert('Login to continue');
  }

  //FireStore
  saveData(id: any): void {
    setDoc(
      doc(this.firestore, 'invoices', id ? `${id}` : `${this.invoiceNo.value}`),
      {
        vehicleNo: this.vehicleNo.value,
        wsCode: this.wsCode.value,
        wsName: this.wsName.value,
        wsTown: this.wsTown.value,
        distance: this.distance.value,
        KOT: this.KOT.value,
        mlrNo: this.mlrNo.value,
        gstInvoiceNo: this.invoiceNo.value,
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
        userDisplayName: this.authenticationService.currentUser?.displayName,
        userEmail: this.authenticationService.currentUser?.email,

        billingDate: this.vehicleNo.value,
        soldToParty: this.vehicleNo.value,
        customerName: this.vehicleNo.value,
        billingDoc: this.vehicleNo.value,
        invoiceNo: this.vehicleNo.value,
        totalInvoiceAmt: this.vehicleNo.value,
        salesShipmentDiff: this.vehicleNo.value,
        shipmentNo: this.vehicleNo.value,
        shipmentCostDate: this.vehicleNo.value,
        transporterName: this.vehicleNo.value,
        serviceAgent: this.vehicleNo.value,
        ownership: this.vehicleNo.value,
      }
    );
  }

  delData(id: any): void {
    deleteDoc(doc(this.firestore, `/invoices/${id}`))
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

  getSingleDoc(id: any): void {
    const docSnap = getDoc(doc(this.firestore, 'invoices', `${id}`)).then(
      (doc) => {
        if (doc.exists()) {
          this.updateData.invoiceNo = doc.data()?.['invoiceNo'];
          this.updateData.vehicleNo = doc.data()?.['vehicleNo'];
          this.gotData = true;
        } else {
          alert('No Data Found');
          this.resetForm();
          this.gotData = false;
          this.update = false;
        }
      }
    );
  }

  handleSubmit(id: any): void {
    const myArray: any[] = [
      'invoiceNo',
      'vehicleNo',
      'wsCode',
      'wsName',
      'wsTown',
      'distance',
      'KOT',
      'mlrNo',
      'labour',
      'deiselVoucherNo',
      'deiselAmt',
      'Khuraki',
      'frieght',
      'toll',
      'repairs',
      'cashExp',
      'invoiceAckn',
      'mlrAckn',
    ];
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].value == '') {
        alert('Enter Details');
        return;
      }
    }

    if (this.authenticationService.currentUser) {
      this.saveData(id);
      this.resetForm();
      this.add = false;
      this.update = false;
      this.invoicesData = [];
      this.getInvoices();
      this.gotData = false;
      this.toastr.success('Created Succesfully');
    } else alert('Login to continue...');
  }

  handleDelete(id: any): void {
    if (this.authenticationService.currentUser) {
      this.delData(id);
      this.resetForm();
      this.del = false;
      this.invoicesData = [];
      this.getInvoices();
    } else alert('Login to continue...');
  }

  create(): void {
    this.add = true;
    this.update = false;
    this.del = false;
  }

  upd(id: any): void {
    if (this.authenticationService.currentUser) {
      this.update = true;
      this.add = false;
      this.del = false;
      this.invoiceId = id;
      this.getSingleDoc(id);
    } else alert('Login to continue...');
  }

  delt(): void {
    this.del = true;
    this.update = false;
    this.update = false;
  }

  //Upload Excel
  xlUpload(event: any): void {
    let reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    reader.onload = (e: any) => {
      if (e != null) {
        let spreadSheetWorkBook = read(e.target.result, { type: 'binary' });
        const data = utils.sheet_to_json<any>(
          spreadSheetWorkBook.Sheets[spreadSheetWorkBook.SheetNames[0]]
        );
        for (let i = 0; i < data.length; i++) {
          this.uploadDataXl(data[i]);
          // console.log(data[i]);
        }
        this.getInvoices();
      }
    };
  }

  uploadDataXl(data: any): void {
    if (data?.['Custom Invoice No'] && data?.['Customer Name'])
      setDoc(
        doc(this.firestore, 'invoices', `${data?.['Custom Invoice No']}`),
        {
          customerName: data?.['Customer Name'],
          vehicleNo: data?.['Lorry No'],
          wsCode: '',
          wsName: '',
          wsTown: '',
          distance: '',
          KOT: data?.['KOT'],
          mlrNo: data?.['LR No'],
          labour: '',
          deiselVoucherNo: '',
          deiselAmt: '',
          Khuraki: '',
          frieght: data?.['Shipment Cost'],
          toll: '',
          repairs: '',
          billingDate: data?.['Billing Date'],
          soldToParty: data?.['Sold-To Party'],
          billingDoc: data?.['Billing Document'],
          gstInvoiceNo: data?.['GST Invoice Number'],
          salesShipmentDiff: data?.['Sales Value Minus Shipment Cost'],
          shipmentNo: data?.['Shipment Number'],
          transporterName: data?.['Transporter Name'],
          shipmentCostDate: data?.['Shipment Cost Date'],
          serviceAgent: data?.['Service agent'],
          ownership: data?.['Ownership'],
          totalInvoiceAmt: data?.['Total Invoice Amount'],
          userDisplayName: this.authenticationService.currentUser?.displayName,
          userEmail: this.authenticationService.currentUser?.email,
        }
      );
  }
}
