import LoginUI from "../views/LoginUI"
import Login from '../containers/Login.js'
import { ROUTES } from "../constants/routes"
import { fireEvent, screen } from "@testing-library/dom"
import firebase from "../__mocks__/firebase";
import { checkIfUserExists, createUser } from "../containers/FirestoreCaller";

describe("Given that I am a user on login page", () => {
  describe("When I do not fill fields and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("employee-email-input")
      expect(inputEmailUser.value).toBe("")
          
      const inputPasswordUser = screen.getByTestId("employee-password-input")
      expect(inputPasswordUser.value).toBe("")
  
      const form = screen.getByTestId("form-employee")
      const handleSubmit = jest.fn(e => e.preventDefault())  
  
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(screen.getByTestId("form-employee")).toBeTruthy()
    })
  })

  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("employee-email-input")
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } })
      expect(inputEmailUser.value).toBe("pasunemail")
          
      const inputPasswordUser = screen.getByTestId("employee-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } })
      expect(inputPasswordUser.value).toBe("azerty")
  
      const form = screen.getByTestId("form-employee")
      const handleSubmit = jest.fn(e => e.preventDefault())  
  
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(screen.getByTestId("form-employee")).toBeTruthy()
    })
  })

  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    test("Then I should be identified as an Employee in app", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty"
      }

      const inputEmailUser = screen.getByTestId("employee-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)
          
      const inputPasswordUser = screen.getByTestId("employee-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-employee")
      
      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ''

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        firestore: firebase
      })

      const handleSubmit = jest.fn(login.handleSubmitEmployee)    
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected"
        })
      )
    })  

    test("Then I should be identified as an Employee in app with existing user", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        email: "test",
        password: "azerty"
      }

      const inputEmailUser = screen.getByTestId("employee-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)
          
      const inputPasswordUser = screen.getByTestId("employee-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-employee")
      
      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ''

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        firestore: firebase
      })

      const handleSubmit = jest.fn(login.handleSubmitEmployee)    
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected"
        })
      )
    })

    test("It should renders Bills page", () => {
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })

  })
})

describe("Given that I am a user on login page", () => {
  describe("When I do not fill fields and I click on admin button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("admin-email-input")
      expect(inputEmailUser.value).toBe("")
          
      const inputPasswordUser = screen.getByTestId("admin-password-input")
      expect(inputPasswordUser.value).toBe("")
  
      const form = screen.getByTestId("form-admin")
      const handleSubmit = jest.fn(e => e.preventDefault())  
  
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(screen.getByTestId("form-admin")).toBeTruthy()
    })
  })

  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    test("Then it should renders Login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } })
      expect(inputEmailUser.value).toBe("pasunemail")
          
      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } })
      expect(inputPasswordUser.value).toBe("azerty")
  
      const form = screen.getByTestId("form-admin")
      const handleSubmit = jest.fn(e => e.preventDefault())  
  
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(screen.getByTestId("form-admin")).toBeTruthy()
    })
  })

  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an HR admin in app", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected"
      }

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)
          
      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-admin")
      
      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ''

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        firestore: firebase
      })

      const handleSubmit = jest.fn(login.handleSubmitAdmin)

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected"
        })
      )
    })

    test("Then I should be identified as an HR admin in app with existing admin", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        type: "Admin",
        email: "test",
        password: "azerty",
        status: "connected"
      }

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)
          
      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-admin")
      
      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ''

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        firestore: firebase
      })

      const handleSubmit = jest.fn(login.handleSubmitAdmin)

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected"
        })
      )
    })

    test("It should renders HR dashboard page", () => {
      expect(screen.queryByText('Validations')).toBeTruthy()
    })

    test("Creating a new admin user", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected"
      }

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
          
      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } })

      const form = screen.getByTestId("form-admin")

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ''

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        firestore: firebase
      })

      const handleSubmit = jest.fn(login.handleSubmitAdmin)    

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})


describe("When I create an account", () => {
  test("User does not exists", async () => {
    const userExists = await checkIfUserExists(firebase, { email: "" });

    expect(userExists).toBeFalsy();
  })
  test("User does exists", async () => {
    const userExists = await checkIfUserExists(firebase, { email: "test" });

    expect(userExists).toBeTruthy();
  })
  test("Checking user fails", async () => {
    const error = await checkIfUserExists(firebase, { email: "reject", type: "admin" });

    expect(error.message).toEqual("Error when checking user");
  })
  test("Firestore is undefined", async () => {
    const user = await createUser(undefined);
    const checkUser = await checkIfUserExists(undefined);

    expect(user).toBeNull();
    expect(checkUser).toBeNull();
  })
  test("Creating a user in Firestore", async () => {
    const setSpy = jest.spyOn(firebase, "users");
  
    await createUser(firebase, { email: "test", type: "admin" });

    expect(setSpy).toHaveBeenCalledTimes(1);
  })
  test("Creating a user fails", async () => {
    firebase.users.mockImplementationOnce(() => {
      return {
        doc: function(email) {
          return {
            set: function(obj) {
              return Promise.reject(new Error("Error when creating user"));
            }
          }
        }
      }
    })

    const error = await createUser(firebase, { email: "test", type: "admin" });

    expect(error.message).toEqual("Error when creating user");
  })
})