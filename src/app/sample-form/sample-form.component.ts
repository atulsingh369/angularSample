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
import { ComparePassword } from './customvalidator.validator';
import { AuthenticationService } from '../core/services/authentication/authentication.service';

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
  updateData: any[] = [];
  add: boolean = false;
  update: boolean = false;
  del: boolean = false;
  gotData: boolean = false;
  log: boolean = false;
  regis: boolean = false;
  isResPass: boolean = false;

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

          setDoc(
            doc(
              this.firestore,
              'users',
              `${this.userEmails.controls['email'].value}`
            ),
            {
              displayName: this.userEmails.controls['name'].value,
              email: this.userEmails.controls['email'].value,
            }
          );

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
        localStorage.removeItem('user');
        alert('Logged Out');
        this.getAuthData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAuthData(): void {
    this.user = this.authenticationService.currentUser;
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
        userDisplayName: this.authenticationService.currentUser?.displayName,
        userEmail: this.authenticationService.currentUser?.email,
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
    if (this.authenticationService.currentUser) {
      this.saveData();
      this.resetForm();
      this.add = false;
      this.update = false;
      this.invoicesData = [];
      this.getInvoices();
      this.gotData = false;
      this.toastr.success('Created Succesfully');
    } else alert('Login to continue...');
  }

  handleDelete(): void {
    if (this.authenticationService.currentUser) {
      this.delData();
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
