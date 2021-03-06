import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills.js";
import firebase from "../__mocks__/firebase";
import { getBill, getBills } from "../containers/FirestoreCaller.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      localStorage.setItem("user", `{"type":"Employee","email":"noobnoob@yopmail.com","password":"1234","status":"connected"}`);

      const html = BillsUI({ data: []});
      document.body.innerHTML = html;

      const button = document.getElementById("layout-icon1");
      const className = "active-icon";
      const buttonClassName = button.className;

      expect(buttonClassName).toEqual(className);
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });

      document.body.innerHTML = html;

      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);

      expect(dates).toEqual(datesSorted);
    })
    test("Bills with loading page", () => {
      const html = BillsUI({ data: [], loading: true});
      document.body.innerHTML = html;

      const content = document.getElementById("loading");

      expect(content.innerHTML).toEqual("Loading...");
    })
    test("Bills with error page", () => {
      const html = BillsUI({ data: [], loading: false, error: "Error"});
      document.body.innerHTML = html;

      const content = document.getElementById("error");

      expect(content.innerHTML).toEqual("Error");
    })
    test("Clicking on new bill button", () => {
      const html = BillsUI({ data: bills });

      document.body.innerHTML = html;

      let currentPage = "";
      let onNavigate = function(path) {
        currentPage = path;
      };

      const bill = new Bills({document, onNavigate, undefined, localStorage});
      bill.handleClickNewBill();

      expect(currentPage).toEqual("#employee/bill/new");
    })
    test("Clicking on eye icon", () => {
      const html = BillsUI({ data: bills });

      document.body.innerHTML = html;

      const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
      new Bills({document, undefined, undefined, localStorage});

      iconEye[0].click();

      const modal = document.getElementById("modaleFile");

      setTimeout(() => {
        expect(modal.className).toEqual("modal fade show");
      }, 2000);
    })
    test("HTML without button New bill", () => {
      let error = "";
      document.body.innerHTML = "";

      try {
        new Bills({document, undefined, undefined, localStorage});
      } catch (err) {
        error = err.message;
      }

      expect(error).toEqual("Button new bill cannot be null or undefined");
    })
    test("HTML without icon eye", () => {
      let error = "";
      document.body.innerHTML = '<button type="button" data-testid="btn-new-bill" class="btn btn-primary">Nouvelle note de frais</button>';

      try {
        new Bills({document, undefined, undefined, localStorage});
      } catch (err) {
        error = err.message;
      }

      expect(error).toEqual("Icon eye cannot be null or undefined");
    })
    test("Getting a bill data", () => {
      const doc = {
        data: function() {
          return {
            date: "2001-01-01",
            status: "pending"
          }
        }
      };

      const billData = getBill(doc);

      expect(billData.date).toEqual("2001-01-01");
      expect(billData.formatedDate).toEqual("1 Jan. 01");
      expect(billData.status).toEqual("En attente");
    })
    test("Getting a incorrect date bill data", () => {
      const doc = {
        data: function() {
          return {
            date: "200000-01-01",
            status: "pending"
          }
        }
      };

      const billData = getBill(doc);

      expect(billData.date).toEqual("200000-01-01");
      expect(billData.formatedDate).toEqual(undefined);
      expect(billData.status).toEqual("pending");
    })
    test("Getting a incorrect status bill data", () => {
      const doc = {
        data: function() {
          return {
            date: "2000-01-01",
            status: "ill??gal"
          }
        }
      };

      const billData = getBill(doc);

      expect(billData.date).toEqual("2000-01-01");
      expect(billData.formatedDate).toEqual(undefined);
      expect(billData.status).toEqual("ill??gal");
    })
  })
})

// test d'int??gration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "bills");

      localStorage.setItem("user", `{"type":"Employee","email":"noobnoob@yopmail.com","password":"1234","status":"connected"}`);

      const bills = await getBills(firebase);

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.length).toBe(1);
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.bills.mockImplementationOnce(() => {
        return {
          get: function() {
            return Promise.reject(new Error("Erreur 404"));
          }
        }
      })

      localStorage.setItem("user", `{"type":"Employee","email":"noobnoob@yopmail.com","password":"1234","status":"connected"}`);

      const error = await getBills(firebase);

      expect(error.message).toEqual("Erreur 404");
    })
    test("fetches bills from an undefined API", async () => {
      let error;
      localStorage.removeItem("user");

      try {
        getBills(null);
      } catch (err) {
        error = err.message;
      }

      expect(error).toEqual("Firestore cannot be null or undefined");
    })
  })
})