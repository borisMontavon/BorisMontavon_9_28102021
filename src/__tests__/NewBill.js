import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import firebase from "../__mocks__/firebase";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
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