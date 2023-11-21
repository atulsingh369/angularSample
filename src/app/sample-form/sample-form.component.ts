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
  distance = new FormControl();
  labour = new FormControl('');
  mlrNo = new FormControl();
  frieght = new FormControl();
  deiselVoucherNo = new FormControl('');
  deiselAmt = new FormControl();
  Khuraki = new FormControl();
  toll = new FormControl();
  repairs = new FormControl();
  cashExp = new FormControl('');
  ownership = new FormControl('');
  invoiceAckn = new FormControl('');
  mlrAckn = new FormControl('');
  resPass = new FormControl('');
  billingDate = new FormControl('');
  soldToParty = new FormControl();
  customerName = new FormControl('');
  billingDoc = new FormControl('');
  gstInvoiceNo = new FormControl('');
  KOT = new FormControl();
  totalInvoiceAmt = new FormControl();
  salesShipmentDiff = new FormControl();
  shipmentNo = new FormControl();
  shipmentCostDate = new FormControl('');
  transporterName = new FormControl('');
  serviceAgent = new FormControl('');
  ownershipnew = new FormControl('');
  userDisplayName = new FormControl('');
  userEmail = new FormControl('');

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

          this.toastr.success(`Welcome ${this.user.displayName}`);
          this.userEmails.reset();
          this.userEmails.controls['name'].setErrors(null);
          this.userEmails.controls['email'].setErrors(null);
          this.userEmails.controls['password'].setErrors(null);
          this.log = false;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.toastr.error(errorCode);
          this.userEmails.reset();
          this.userEmails.controls['name'].setErrors(null);
          this.userEmails.controls['email'].setErrors(null);
          this.userEmails.controls['password'].setErrors(null);
        });
    } else this.toastr.info('Enter Details');
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
          this.toastr.info('User registered');
          this.regis = false;
        })
        .catch((error) => {
          const errorCode = error.code;
          this.toastr.info(errorCode);
        });
    } else this.toastr.info('Enter Details');
  }

  googleLogin(): void {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(
      async (credentials: UserCredential) => {
        this.user = credentials.user;
        this.log = false;
        localStorage.setItem('userData', JSON.stringify(this.user));
        setDoc(doc(this.firestore, 'users', `${this.user.uid}`), {
          displayName: this.user.displayName,
          email: this.user.email,
        });
      }
    );
    this.toastr.success(`Welcome ${this.user.displayName}`);
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
        this.toastr.info('Logged Out');
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
            this.toastr.success('Password has changed');
          })
          .catch((error) => {
            this.toastr.error(error.code);
          });
        this.isResPass = false;
        this.resPass.reset('');
      } else {
        this.toastr.error('Enter Details');
      }
    } else this.toastr.error('Login to continue');
  }

  //FireStore
  saveData(id: any): void {
    try {
      setDoc(
        doc(
          this.firestore,
          'invoices',
          id ? `${id}` : `${this.invoiceNo.value}`
        ),
        {
          vehicleNo:
            this.vehicleNo.value !== ''
              ? this.vehicleNo.value
              : this.updateData.vehicleNo,
          wsCode:
            this.wsCode.value !== ''
              ? this.wsCode.value
              : this.updateData.wsCode,
          wsName:
            this.wsName.value !== ''
              ? this.wsName.value
              : this.updateData.wsName,
          wsTown:
            this.wsTown.value !== ''
              ? this.wsTown.value
              : this.updateData.wsTown,
          distance:
            this.distance.value !== ''
              ? this.distance.value
              : this.updateData.distance,
          KOT: this.KOT.value !== '' ? this.KOT.value : this.updateData.KOT,
          mlrNo:
            this.mlrNo.value !== '' ? this.mlrNo.value : this.updateData.mlrNo,
          gstInvoiceNo:
            this.invoiceNo.value !== ''
              ? this.invoiceNo.value
              : this.updateData.gstInvoiceNo,
          labour:
            this.labour.value !== ''
              ? this.labour.value
              : this.updateData.labour,
          deiselVoucherNo:
            this.deiselVoucherNo.value !== ''
              ? this.deiselVoucherNo.value
              : this.updateData.deiselVoucherNo,
          deiselAmt:
            this.deiselAmt.value !== ''
              ? this.deiselAmt.value
              : this.updateData.deiselAmt,
          Khuraki:
            this.Khuraki.value !== ''
              ? this.Khuraki.value
              : this.updateData.Khuraki,
          frieght:
            this.vehicleNo.value !== ''
              ? this.vehicleNo.value
              : this.updateData.vehicleNo,
          toll: this.toll.value !== '' ? this.toll.value : this.updateData.toll,
          repairs:
            this.repairs.value !== ''
              ? this.repairs.value
              : this.updateData.repairs,
          cashExp: this.cashExp.value,
          invoiceAckn: this.vehicleNo.value,
          mlrAckn: this.vehicleNo.value,
          userDisplayName: this.authenticationService.currentUser?.displayName,
          userEmail: this.authenticationService.currentUser?.email,

          billingDate:
            this.billingDate.value !== ''
              ? this.billingDate.value
              : this.updateData.billingDate,
          soldToParty:
            this.soldToParty.value !== ''
              ? this.soldToParty.value
              : this.updateData.soldToParty,
          customerName:
            this.customerName.value !== ''
              ? this.customerName.value
              : this.updateData.customerName,
          billingDoc:
            this.billingDoc.value !== ''
              ? this.billingDoc.value
              : this.updateData.billingDoc,

          totalInvoiceAmt:
            this.totalInvoiceAmt.value !== ''
              ? this.totalInvoiceAmt.value
              : this.updateData.totalInvoiceAmt,
          salesShipmentDiff:
            this.salesShipmentDiff.value !== ''
              ? this.salesShipmentDiff.value
              : this.updateData.salesShipmentDiff,
          shipmentNo:
            this.shipmentNo.value !== ''
              ? this.shipmentNo.value
              : this.updateData.shipmentNo,
          shipmentCostDate:
            this.shipmentCostDate.value !== ''
              ? this.shipmentCostDate.value
              : this.updateData.shipmentCostDate,
          transporterName:
            this.transporterName.value !== ''
              ? this.transporterName.value
              : this.updateData.transporterName,
          serviceAgent:
            this.serviceAgent.value !== ''
              ? this.serviceAgent.value
              : this.updateData.serviceAgent,
          ownership:
            this.ownership.value !== ''
              ? this.ownership.value
              : this.updateData.ownership,
        }
      );
      id
        ? this.toastr.success('DataSet Updated')
        : this.toastr.success('DataSet Created');
    } catch (error: any) {
      this.toastr.error(error.code);
    }
  }

  delData(id: any): void {
    deleteDoc(doc(this.firestore, `/invoices/${id}`))
      .then((data) => {
        this.toastr.success(`DataSet Deleted`);
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
    this.customerName.setValue('');
    this.wsCode.setValue('');
    this.billingDate.setValue('');
    this.billingDoc.setValue('');
    this.gstInvoiceNo.setValue('');
    this.ownership.setValue('');
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
          this.updateData.gstInvoiceNo = doc.data()?.['gstInvoiceNo'];
          this.updateData.vehicleNo = doc.data()?.['vehicleNo'];
          (this.updateData.customerName = doc.data()?.['customerName']),
            (this.updateData.wsCode = doc.data()?.['wsCode']);
          this.updateData.wsName = doc.data()?.['wsName'];
          this.updateData.wsTown = doc.data()?.['wsTown'];
          this.updateData.distance = doc.data()?.['distance'];
          (this.updateData.KOT = doc.data()?.['KOT']),
            (this.updateData.mlrNo = doc.data()?.['mlrNo']),
            (this.updateData.labour = doc.data()?.['labour']);
          this.updateData.deiselVoucherNo = doc.data()?.['deiselVoucherNo'];
          this.updateData.deiselAmt = doc.data()?.['deiselAmt'];
          this.updateData.Khuraki = doc.data()?.['Khuraki'];
          (this.updateData.frieght = doc.data()?.['frieght']),
            (this.updateData.toll = doc.data()?.['toll']);
          this.updateData.repairs = doc.data()?.['repairs'];
          (this.updateData.billingDate = doc.data()?.['billingDate']),
            (this.updateData.soldToParty = doc.data()?.['soldToParty']),
            (this.updateData.billingDoc = doc.data()?.['billingDoc']),
            (this.updateData.salesShipmentDiff =
              doc.data()?.['salesShipmentDiff']),
            (this.updateData.shipmentNo = doc.data()?.['shipmentNo']),
            (this.updateData.transporterName = doc.data()?.['transporterName']),
            (this.updateData.shipmentCostDate =
              doc.data()?.['shipmentCostDate']),
            (this.updateData.serviceAgent = doc.data()?.['serviceAgent']),
            (this.updateData.ownership = doc.data()?.['ownership']),
            (this.updateData.totalInvoiceAmt = doc.data()?.['totalInvoiceAmt']),
            (this.gotData = true);
        } else {
          this.toastr.error('No Data Found');
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
        this.toastr.info('Enter Details');
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
    } else this.toastr.info('Login to continue...');
  }

  handleDelete(id: any): void {
    if (this.authenticationService.currentUser) {
      this.delData(id);
      this.resetForm();
      this.del = false;
      this.invoicesData = [];
      this.getInvoices();
    } else this.toastr.error('Login to continue...');
  }

  create(): void {
    this.add = true;
    this.update = false;
    this.del = false;
  }

  upd(id: any): void {
    if (this.authenticationService.currentUser) {
      this.update = true;
      this.resetForm();
      this.add = false;
      this.del = false;
      this.invoiceId = id;
      this.getSingleDoc(id);
    } else this.toastr.error('Login to continue...');
  }

  delt(): void {
    this.del = true;
    this.update = false;
  }

  cancel(): void {
    this.add = false;
    this.update = false;
    this.del = false;
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
        this.toastr.success('Data Added Successfully');
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
