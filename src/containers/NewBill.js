import { ROUTES_PATH } from "../constants/routes.js";
import { createBill } from "./FirestoreCaller.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;

    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`);
    
    if (formNewBill) {
      formNewBill.addEventListener("submit", this.handleSubmit);
    } else {
      throw new Error("Form new bill cannot be null or undefined");
    }
    
    const file = this.document.querySelector(`input[data-testid="file"]`);
    
    if (file) {
      file.addEventListener("change", this.handleChangeFile);
    } else {
      throw new Error("File cannot be null or undefined");
    }
    
    this.fileUrl = null;
    this.fileName = null;
    
    new Logout({ document, localStorage, onNavigate });
  }

  handleChangeFile = async (e) => {
    const inputFile = this.document.querySelector(`input[data-testid="file"]`);
    const file = e.target.value;
    const uploadedFile = this.document.querySelector(`input[data-testid="file"]`).files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length-1];
    const errorSpan = this.document.getElementById("wrong-uploaded-file");

    if (file != "") {
      const extension = file.substring(file.lastIndexOf(".") + 1).toLowerCase();

      if (extension === "jpg" || extension === "jpeg" || extension === "png") {
        errorSpan.style.display = "none";
        this.firestore.storage.ref(`justificatifs/${fileName}`)
          .put(uploadedFile)
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            this.fileUrl = url;
            this.fileName = fileName;
          });
        
        return true;
      } else {
        inputFile.type = "";
        inputFile.type = "file";
        errorSpan.style.display = "block";
      }
    }

    return false;
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value);
    
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    };

    createBill(this.firestore, bill).then(() => {
      this.onNavigate(ROUTES_PATH['Bills']);
    })
  }
}