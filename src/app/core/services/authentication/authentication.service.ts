import { Injectable } from '@angular/core';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
	currentUser: User | null = null;
	
  constructor(private auth: Auth) {
		onAuthStateChanged(this.auth, (user: User | null) => {
			this.currentUser = user;
		});
  }
}
