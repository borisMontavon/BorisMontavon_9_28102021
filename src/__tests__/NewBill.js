import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import firebase from "../__mocks__/firebase";
import { createBill } from "../containers/FirestoreCaller";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I upload a new file", async () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({document, undefined, firestore: firebase, undefined});

      const result1 = await newBill.handleChangeFile({ target: { value: "test\\test.jpg"}});
      const result2 = await newBill.handleChangeFile({ target: { value: "test\\test.jpeg"}});
      const result3 = await newBill.handleChangeFile({ target: { value: "test\\test.png"}});
      const result4 = await newBill.handleChangeFile({ target: { value: "test\\test"}});
      const result5 = await newBill.handleChangeFile({ target: { value: ""}});

      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result3).toBeTruthy();
      expect(result4).toBeFalsy();
      expect(result5).toBeFalsy();
    })
    test("Then I create a new bill", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      localStorage.setItem("user", `{"type":"Employee","email":"noobnoob@yopmail.com","password":"1234","status":"connected"}`);

      let currentPage = "";
      let onNavigate = function(path) {
        currentPage = path;
        
        expect(currentPage).toEqual("#employee/bills");
      };

      new NewBill({document, onNavigate, firestore: firebase, localStorage});
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`);

      formNewBill.submit();
    })
    test("HTML without Form new bill", () => {
      let error = "";
      document.body.innerHTML = '';

      try {
        new NewBill({document, undefined, undefined, undefined});
      } catch (err) {
        error = err.message;
      }

      expect(error).toEqual("Form new bill cannot be null or undefined");
    })
    test("HTML without File input", () => {
      let error = "";
      document.body.innerHTML = '<form data-testid="form-new-bill"></form>';

      try {
        new NewBill({document, undefined, undefined, undefined});
      } catch (err) {
        error = err.message;
      }

      expect(error).toEqual("File cannot be null or undefined");
    })

    test("create bill from an API and fails with 404 message error", async () => {
      const error = await createBill(firebase, "reject");

      expect(error.message).toEqual("Erreur 404");
    })

    test("create bill with undefined firestore", async () => {
      const bill = await createBill(undefined, "");

      expect(bill).toBeNull();
    })
  })
})