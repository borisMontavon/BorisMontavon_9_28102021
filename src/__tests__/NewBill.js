import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import firebase from "../__mocks__/firebase";

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
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    describe("When I navigate to New Bill page", () => {
      test("create bill from mock API POST", async () => {
        const getSpy = jest.spyOn(firebase, "bills");

        let currentPage = "";
        let onNavigate = function(path) {
          currentPage = path;
        };
  
        const newBill = new NewBill({document, onNavigate, firestore: firebase, undefined});
        await newBill.createBill("");
  
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(currentPage).toEqual("#employee/bills");
      })
      test("create bill from an API and fails with 404 message error", async () => {
        firebase.bills.mockImplementationOnce(() => {
          return {
            add: function() {
              return Promise.reject(new Error("Erreur 404"));
            }
          }
        })
  
        const newBill = new NewBill({document, undefined, firestore: firebase, undefined});
        const error = await newBill.createBill("");
  
        expect(error.message).toEqual("Erreur 404");
      })
    })
  })
})