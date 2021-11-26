import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;

    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`);

    if (buttonNewBill) {
      buttonNewBill.addEventListener('click', this.handleClickNewBill);
    } else {
      throw new Error("Button new bill cannot be null or undefined");
    }
    
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);

    if (iconEye && iconEye.length > 0) {
      iconEye.forEach(icon => {
        icon.addEventListener('click', (e) => this.handleClickIconEye(icon))
      });
    } else {
      throw new Error("Icon eye cannot be null or undefined");
    }

    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = e => {
    this.onNavigate(ROUTES_PATH['NewBill']);
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;'><img src=${billUrl} /></div>`);
    $('#modaleFile').modal('show');
  }
}