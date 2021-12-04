import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"
import { getBillsAllUsers, updateBill } from './FirestoreCaller.js'

export const filteredBills = (data, status) => {
  return (data && data.length) ? data.filter(bill => {
      let selectCondition;

      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status);
      } else {
        // in prod environment
        const userEmail = JSON.parse(localStorage.getItem("user")).email;
        const validDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

        selectCondition = (bill.status === status) && [...USERS_TEST, userEmail].includes(bill.email) && validDate.test(bill.date) && !Number.isNaN(bill.amount);
      }

      return selectCondition;
    }) : [];
}

export const orderBills = (bills) => {
  return bills.sort((a, b) => {
    if (new Date(b.date) > new Date(a.date)) {
      return 1;
    }

    return -1;
  });
}

export const card = (bill, currentCardId) => {
  const firstAndLastNames = bill.email.split('@')[0];
  const firstName = firstAndLastNames.includes('.') ? firstAndLastNames.split('.')[0] : '';
  const lastName = firstAndLastNames.includes('.') ? firstAndLastNames.split('.')[1] : firstAndLastNames;
  const style = currentCardId !== undefined && currentCardId === bill.id ? `style="background: rgb(42, 43, 53) none repeat scroll 0% 0%;"` : "";

  return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}' ${style}>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `);
}

export const cards = (bills, currentCardId) => {
  return bills && bills.length ? bills.map(bill => card(bill, currentCardId)).join("") : "";
}

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending";
    case 2:
      return "accepted";
    case 3:
      return "refused";
  }
}

export default class {
  constructor({ document, onNavigate, firestore, bills, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;
    // We keep the state of which card is open
    this.displayedGroupOfTickets = [false, false, false];

    $('#arrow-icon1').on("click", ((e) => this.handleShowTickets(e, bills, 1)));
    $('#arrow-icon2').on("click", ((e) => this.handleShowTickets(e, bills, 2)));
    $('#arrow-icon3').on("click", ((e) => this.handleShowTickets(e, bills, 3)));
    
    getBillsAllUsers(this.firestore);
    
    new Logout({ localStorage, onNavigate });
  }

  handleClickIconEye = () => {
    const billUrl = $('#icon-eye-d').attr("data-bill-url");

    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img src=${billUrl} /></div>`);

    if (typeof $('#modaleFileAdmin1').modal === 'function') {
      $('#modaleFileAdmin1').modal('show');
    } else {
      throw new Error("Modal function cannot be undefined");
    }
  }

  handleShowTickets(e, bills, index) {
    if (this.index === undefined || this.index !== index) {
      this.index = index;
    }

    // If the ticket group is not displayed, we display it 
    if (!this.displayedGroupOfTickets[this.index - 1]) {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)'});
      $(`#status-bills-container${this.index}`).html(cards(orderBills(filteredBills(bills, getStatus(this.index))), this.id));

      // We update the ticket group displayed state
      this.displayedGroupOfTickets[this.index - 1] = true;

      filteredBills(bills, getStatus(this.index)).forEach((bill) => {
        $(`#open-bill${bill.id}`).on("click", ((e) => this.handleEditTicket(e, bill, bills)));
      });
    } else {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)'});
      $(`#status-bills-container${this.index}`).html("");

      // We update the ticket group displayed state
      this.displayedGroupOfTickets[this.index - 1] = false;
    }
  }

  handleEditTicket(e, bill, bills) {
    if (this.displayTicket === undefined || this.id !== bill.id) {
      this.displayTicket = true;
    }
    
    if (this.id === undefined || this.id !== bill.id) {
      this.id = bill.id;
    }

    // We display a ticket
    if (this.displayTicket) {
      bills.forEach(b => {
        $(`#open-bill${b.id}`).css({ background: '#0D5AE5' });
      });

      $(`#open-bill${bill.id}`).css({ background: '#2A2B35' });
      $('.dashboard-right-container div').html(DashboardFormUI(bill));
      $('.vertical-navbar').css({ height: '150vh' });

      // For future action : if we click on the same ticket (ticket currently displayed), we close the ticket
      this.displayTicket = false;

      $('#icon-eye-d').on("click", (this.handleClickIconEye));
      $('#btn-accept-bill').on("click", (e) => this.handleAcceptSubmit(e, bill));
      $('#btn-refuse-bill').on("click", (e) => this.handleRefuseSubmit(e, bill));
    } else {
      // We close the ticket if bill.id is the same as the one currently displayed
      $(`#open-bill${bill.id}`).css({ background: '#0D5AE5' });
      $('.dashboard-right-container div').html(`
        <div id="big-billed-icon"> ${BigBilledIcon} </div>
      `);
      $('.vertical-navbar').css({ height: '120vh' });

      // If displayticket is false, the next action on click will be to display a ticket
      this.displayTicket = true;
      this.id = undefined;
    }
  }

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'accepted',
      commentAdmin: $('#commentary2').val()
    };

    updateBill(this.firestore, newBill);
    this.onNavigate(ROUTES_PATH['Dashboard']);
  }

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'refused',
      commentAdmin: $('#commentary2').val()
    };

    updateBill(this.firestore, newBill);
    this.onNavigate(ROUTES_PATH['Dashboard']);
  }
}