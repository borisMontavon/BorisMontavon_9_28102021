import { formatDate, formatStatus } from "../app/format.js"

// not need to cover this function by tests
export const getBills = (firestore) => {
    const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : "";

    if (firestore) {
      return firestore.bills().get().then(snapshot => {
        const bills = snapshot.docs.map(doc => getBill(doc)).filter(bill => bill.email === userEmail);

        return bills;
      }).catch(error => error)
    } else {
      throw new Error("Firestore cannot be null or undefined");
    }
}

export const getBill = (doc) => {
    const date = doc.data().date;

    try {
      const validDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

      if (validDate.test(date)) {
        return {
          ...doc.data(),
          date: date,
          formatedDate: formatDate(date),
          status: formatStatus(doc.data().status)
        };
      }
    } catch(e) {
      // if for some reason, corrupted data was introduced, we manage here failing formatDate function
      // log the error and return unformatted date in that case
      console.log(e,'for', doc.data());
    }

    return {
      ...doc.data(),
      date: date,
      status: doc.data().status
    };
}

export const createBill = (firestore, bill) => {
  if (firestore) {
    return firestore.bills().add(bill).then(() => {
      return true;
    }).catch(error => error)
  } else {
    return null;
  }
}

export const checkIfUserExists = (firestore, user) => {
  if (firestore) {
    return firestore.user(user.email).get().then((doc) => {
      if (doc.exists) {
        console.log(`User with ${user.email} exists`);

        return true;
      } else {
        return false;
      }
    }).catch(error => error);
  } else {
    return null;
  }
}

export const createUser = (firestore, user) => {
  if (firestore) {
    return firestore.users().doc(user.email).set({
      type: user.type,
      name: user.email.split('@')[0] 
    }).then(() => console.log(`User with ${user.email} is created`))
    .catch(error => error);
  } else {
    return null;
  }
}

export const getBillsAllUsers = (firestore) => {
  if (firestore) {
    return firestore.bills().get().then(snapshot => {
      const bills = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date,
        status: doc.data().status
      }));

      return bills;
    }).catch(error => error);
  } else {
    return null;
  }
}
  
export const updateBill = (firestore, bill) => {
  if (firestore) {
    return firestore.bill(bill.id).update(bill).then(bill => bill).catch(error => error);
  } else {
    return null;
  }
}