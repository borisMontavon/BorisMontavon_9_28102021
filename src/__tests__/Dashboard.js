import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import DashboardFormUI from "../views/DashboardFormUI.js"
import DashboardUI from "../views/DashboardUI.js"
import Dashboard, { filteredBills, cards, orderBills, card } from "../containers/Dashboard.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import { bills } from "../fixtures/bills"
import { getBillsAllUsers, updateBill } from "../containers/FirestoreCaller.js"


describe('Given I am connected as an Admin', () => {
  describe('When I am on Dashboard page, there are bills, and there is one pending', () => {
    test('Then, filteredBills by pending status should return 1 bill', () => {
      const filtered_bills = filteredBills(bills, "pending")
      expect(filtered_bills.length).toBe(1)
    })
  })
  describe('When I am on Dashboard page, there are bills, and there is one accepted', () => {
    test('Then, filteredBills by accepted status should return 1 bill', () => {
      const filtered_bills = filteredBills(bills, "accepted")
      expect(filtered_bills.length).toBe(1)
    })
  })
  describe('When I am on Dashboard page, there are bills, and there is two refused', () => {
    test('Then, filteredBills by accepted status should return 2 bills', () => {
      const filtered_bills = filteredBills(bills, "refused")
      expect(filtered_bills.length).toBe(2)
    })
  })
  describe('When I am on Dashboard page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      const html = DashboardUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am on Dashboard page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      const html = DashboardUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  describe('When I am on Dashboard page and I click on arrow', () => {
    test('Then, tickets list should be unfolding, and cars should contain first and lastname', async () => {
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const dashboard = new Dashboard({
        document, onNavigate, firestore: null, bills, localStorage: window.localStorage
      })          
      const html = DashboardUI({ data: bills })
   
      document.body.innerHTML = html

      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1)) 
      const handleShowTickets2 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 2))    
      const handleShowTickets3 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 3))    

      const icon1 = screen.getByTestId('arrow-icon1')
      const icon2 = screen.getByTestId('arrow-icon2')
      const icon3 = screen.getByTestId('arrow-icon3')

      icon1.addEventListener('click', handleShowTickets1)
      userEvent.click(icon1)
      expect(handleShowTickets1).toHaveBeenCalled()
      userEvent.click(icon1)

      icon2.addEventListener('click', handleShowTickets2)
      userEvent.click(icon2)
      expect(handleShowTickets2).toHaveBeenCalled()

      icon3.addEventListener('click', handleShowTickets3)
      userEvent.click(icon3)
      expect(handleShowTickets3).toHaveBeenCalled()

    })
  })

  describe('When I am on Dashboard page and I click on edit icon of a card', () => {
    test('Then, right form should be filled', () => {
      const html = cards(bills)
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleEditTicket = jest.fn((e) => dashboard.handleEditTicket(e, bills[0], bills))   
      const iconEdit = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      iconEdit.addEventListener('click', handleEditTicket)
      userEvent.click(iconEdit)
      expect(handleEditTicket).toHaveBeenCalled()
      userEvent.click(iconEdit)
      expect(handleEditTicket).toHaveBeenCalled()
    })
  })

  describe('When I am on Dashboard and there are no bills', () => {
    test('Then, no cards should be shown', () => {
      const html = cards([])
      document.body.innerHTML = html

      const iconEdit = screen.queryByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      expect(iconEdit).toBeNull()
    })
  })
})

describe('Given I am connected as Admin, and I am on Dashboard page, and I clicked on a pending bill', () => {
  describe('When I click on accept button', () => {
    test('I should be sent on Dashboard with big billed icon instead of form', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const acceptButton = screen.getByTestId("btn-accept-bill-d")
      const handleAcceptSubmit = jest.fn((e) => dashboard.handleAcceptSubmit(e, bills[0]))
      acceptButton.addEventListener("click", handleAcceptSubmit)
      fireEvent.click(acceptButton)
      expect(handleAcceptSubmit).toHaveBeenCalled()
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
  describe('When I click on refuse button', () => {
    test('I should be sent on Dashboard with big billed icon instead of form', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })
      const refuseButton = screen.getByTestId("btn-refuse-bill-d")
      const handleRefuseSubmit = jest.fn((e) => dashboard.handleRefuseSubmit(e, bills[0]))
      refuseButton.addEventListener("click", handleRefuseSubmit)
      fireEvent.click(refuseButton)
      expect(handleRefuseSubmit).toHaveBeenCalled()
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
})

describe('Given I am connected as Admin and I am on Dashboard page and I clicked on a bill', () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye)
      const eye = screen.getByTestId('icon-eye-d')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFileAdmin')
      expect(modale).toBeTruthy()
    })
    test('A modal is not a function', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      
      try {
        jQuery.fn.extend({
          modal: ""
        });

        const dashboard = new Dashboard({
          document, onNavigate, firestore, bills, localStorage: window.localStorage
        })
  
        dashboard.handleClickIconEye();
      } catch (err) {
        expect(err.message).toEqual("Modal function cannot be undefined")
      }
    })
  })
  describe("When I click on the arrow icon", () => {
    test("The list of bills at the same index should open", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardUI(bills)
      document.body.innerHTML = html

      const firestore = null
      const dashboard = new Dashboard({
        document, undefined, firestore, bills, localStorage: window.localStorage
      })

      for (let index = 1; index <= 3; index++) {
        const arrow = screen.getByTestId(`arrow-icon${index}`)
        userEvent.click(arrow)

        const billsList = screen.getByTestId(`status-bills-container${index}`)
        expect(billsList).toBeTruthy()
      }
    })
  })
  describe("When I click on a ticket", () => {
    test("The ticket should open", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardUI(bills)
      document.body.innerHTML = html

      const firestore = null
      const dashboard = new Dashboard({
        document, undefined, firestore, bills, localStorage: window.localStorage
      })

      const arrow = screen.getByTestId(`arrow-icon1`)
      userEvent.click(arrow)

      const bill = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      userEvent.click(bill)

      const dashboardForm = screen.getByTestId("dashboard-form")
      expect(dashboardForm).toBeTruthy()
    })
    test("I refuse the ticket", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardUI(bills)
      document.body.innerHTML = html

      const firestore = null
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const arrow = screen.getByTestId(`arrow-icon1`)
      userEvent.click(arrow)

      const bill = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      userEvent.click(bill)

      const refuse = screen.getByTestId('btn-refuse-bill-d')
      userEvent.click(refuse)

      const bigBilledIcon = screen.getByTestId('big-billed-icon')
      expect(bigBilledIcon).toBeTruthy()
    })
    test("I accept the ticket", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardUI(bills)
      document.body.innerHTML = html

      const firestore = null
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const arrow = screen.getByTestId(`arrow-icon1`)
      userEvent.click(arrow)

      const bill = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      userEvent.click(bill)

      const accept = screen.getByTestId('btn-accept-bill-d')
      userEvent.click(accept)

      const bigBilledIcon = screen.getByTestId('big-billed-icon')
      expect(bigBilledIcon).toBeTruthy()
    })
  })
})

describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API", async () => {
      const getSpy = jest.spyOn(firebase, "bills")
      const bills = await getBillsAllUsers(firebase);

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.length).toBe(1)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.bills.mockImplementationOnce(() => {
        return {
          get: function() {
            return Promise.reject(new Error("Erreur 404"));
          }
        }
      })

      const error = await getBillsAllUsers(firebase);

      expect(error.message).toEqual("Erreur 404");
    })
    test("Update bill from mock API", async () => {
      const bill = {id: "billId", amount: 50};
      const updatedBill = await updateBill(firebase, bill);

      expect(updatedBill.id).toEqual(bill.id);
      expect(updatedBill.amount).toEqual(100);
    })
    test("Update bill from mock API with error", async () => {
      const bill = {id: "reject"};
      const error = await updateBill(firebase, bill);

      expect(error.message).toEqual("Erreur 500");
    })
    test("Bills should filter by date", () => {
      const dates = [
        {
          date: "2020-11-01",
          id: "date1"
        },
        {
          date: "2021-11-01",
          id: "date2"
        },
        {
          date: "2019-11-20",
          id: "date3"
        }
      ]
      
      const result = orderBills(dates);

      expect(result[0].id).toEqual("date2");
    })
    test("Card with firstname and lastname on current bill", () => {
      const bill = {
        id: 1,
        email: "noob.noob@yopmail.com",
        amount: 50,
        date: "2020-10-20",
        name: "Test",
        type: "type"
      }

      const html = card(bill, 1);

      const render = `
    <div class='bill-card' id='open-bill1' data-testid='open-bill1' style=\"background: rgb(42, 43, 53) none repeat scroll 0% 0%;\">
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> noob noob </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> Test </span>
        <span> 50 € </span>
      </div>
      <div class='date-type-container'>
        <span> 20 Oct. 20 </span>
        <span> type </span>
      </div>
    </div>
  `;

      expect(html).toEqual(render);
    })
  })
})

