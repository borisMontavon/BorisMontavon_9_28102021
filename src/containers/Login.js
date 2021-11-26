import { ROUTES_PATH } from '../constants/routes.js'
import { checkIfUserExists, createUser } from './FirestoreCaller.js';
export let PREVIOUS_LOCATION = ''

// we use a class so as to test its methods in e2e tests
export default class Login {
  constructor({ document, localStorage, onNavigate, PREVIOUS_LOCATION, firestore }) {
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION;
    this.firestore = firestore;

    const formEmployee = this.document.querySelector(`form[data-testid="form-employee"]`);
    const formAdmin = this.document.querySelector(`form[data-testid="form-admin"]`);
    
    formEmployee.addEventListener("submit", this.handleSubmitEmployee);
    formAdmin.addEventListener("submit", this.handleSubmitAdmin);
  }

  handleSubmitEmployee = (e) => {
    const user = {
      type: "Employee",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="employee-password-input"]`).value,
      status: "connected"
    };

    this.localStorage.setItem("user", JSON.stringify(user));

    e.preventDefault();
    
    checkIfUserExists(this.firestore, user).then(userExists => {
      try {
        if (!userExists) {
          createUser(this.firestore, user);
        } else {
          throw new Error("User already exists");
        }
      } catch (err) {
        console.error(err);
      }
  
      this.onNavigate(ROUTES_PATH['Bills']);
      this.PREVIOUS_LOCATION = ROUTES_PATH['Bills'];
      
      PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
      
      document.body.style.backgroundColor="#fff";
    })
  }

  handleSubmitAdmin = (e) => {
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
      status: "connected"
    };

    this.localStorage.setItem("user", JSON.stringify(user));

    e.preventDefault();
    
    checkIfUserExists(this.firestore, user).then(userExists => {
      try {
        if (!userExists) {
          createUser(this.firestore, user);
        } else {
          throw new Error("User already exists");
        }
      } catch (err) {
        console.error(err);
      }
  
      this.onNavigate(ROUTES_PATH['Dashboard']);
      this.PREVIOUS_LOCATION = ROUTES_PATH['Dashboard'];
  
      PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
      
      document.body.style.backgroundColor="#fff";
    })
  }

  // // not need to cover this function by tests
  // checkIfUserExists = async (user) => {
  //   let userExists = true;

  //   if (this.firestore) {
  //     const doc = await this.firestore.user(user.email).get();

  //     if (doc.exists) {
  //       console.log(`User with ${user.email} exists`);
  //     } else {
  //       userExists = false;
  //     }

  //     return userExists;
  //   } else {
  //     return null;
  //   }
  // }

  // // not need to cover this function by tests
  // createUser = async (user) => {
  //   if (this.firestore) {
  //     try {
  //       await this.firestore.users().doc(user.email).set({
  //         type: user.type,
  //         name: user.email.split('@')[0] 
  //       });

  //       console.log(`User with ${user.email} is created`)
  //     } catch (err) {
  //       return err;
  //     }
  //   } else {
  //     return null;
  //   }
  // }
}