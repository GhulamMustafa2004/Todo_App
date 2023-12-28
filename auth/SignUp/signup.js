import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();
const auth = getAuth();
const dataBase = getFirestore();

let fullName = document.getElementById("userName");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");
let googleContinue = document.getElementById("googleLogIn");
let signUpContinue = document.getElementById("submitBtn");
let loginPage = document.getElementById("loginPage");

let userName = "";
let userEmail = "";
let userPassword = "";
let userConfirmPassword = "";
let authStateChanged = 0;

loginPage.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/auth/Login/index.html";
});

loaderShow();
onAuthStateChanged(auth, (user) => {
  if (user) {
    loaderHide();
    if (authStateChanged == 0) {
      window.location.href = "/dashBoard/index.html";
    }
  } else {
    setTimeout(() => {
      loaderHide();
    }, 200);
  }
  ++authStateChanged;
});

googleContinue.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((user) => {
      setDoc(doc(dataBase, "users", user?.user.uid), {
        userName: user.user.displayName,
        userEmail: user.user.email,
      }).then(() => {
        window.location.href = "/dashBoard/index.html";
        loaderHide();
      });
    })
    .catch((error) => {
      console.log(error, "error");
    });
});

signUpContinue.addEventListener("click", (event) => {
  event.preventDefault();
  loaderShow();
  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((user) => {
      setDoc(doc(dataBase, "users", user?.user.uid), {
        userName,
        userEmail,
      }).then(() => {
        window.location.href = "/dashBoard/index.html";
        loaderHide();
      });
    })
    .catch((error) => {
      loaderHide();
      console.log(error, "error");
      if (error.code === "auth/email-already-in-use") {
        const emailError = document.getElementById("emailError");
        emailError.innerHTML = `Email is already in use`;
        emailError.classList.add("displayError");
        document.getElementById("email").classList.add("inputError");
      }
    });
});

let inputlistener = (event, errorMsg, errorId, inputElement, validating) => {
  let value = event.target.value;
  if (validating(value)) {
    document.getElementById(errorId).classList.remove("displayError");
    inputElement.classList.remove("inputError");
  } else {
    inputElement.classList.add("inputError");
    document.getElementById(errorId).innerHTML = errorMsg;
    document.getElementById(errorId).classList.add("displayError");
  }
};

let btnDisable = () => {
  signUpContinue.classList.add("disableBtn");
  if (userName && userEmail && userPassword && userConfirmPassword) {
    if (!(userName.length >= 3)) {
    } else if (!/\S+@\S+/.test(userEmail)) {
    } else if (!(userPassword.length >= 6)) {
    } else if (!(userPassword == confirmPassword.value)) {
      const error = document.getElementById("confirmPasswordError");
      error.innerHTML = "Password does not match";
      error.classList.add("displayError");
      document.getElementById("confirmPassword").classList.add("inputError");
    } else {
      const error = document.getElementById("confirmPasswordError");
      error.classList.remove("displayError");
      document.getElementById("confirmPassword").classList.remove("inputError");
      signUpContinue.classList.remove("disableBtn");
    }
  }
};

let validateFullName = (value) => {
  userName = value;
  btnDisable();
  return value.length >= 3;
};
let validateEmail = (value) => {
  userEmail = value;
  btnDisable();
  return /\S+@\S+/.test(value);
};
let validatePassword = (value) => {
  userPassword = value;
  btnDisable();
  return value.length >= 6;
};
let validateConfirmPassword = (value) => {
  userConfirmPassword = value;
  btnDisable();
  return value == userPassword;
};

fullName.addEventListener("input", () =>
  inputlistener(
    event,
    "Min 3 letter required",
    "userNameError",
    fullName,
    validateFullName
  )
);
email.addEventListener("input", () =>
  inputlistener(event, "Must include @", "emailError", email, validateEmail)
);
password.addEventListener("input", () =>
  inputlistener(
    event,
    "Min. 6 letters",
    "passwordError",
    password,
    validatePassword
  )
);
confirmPassword.addEventListener("input", () =>
  inputlistener(
    event,
    "Password does't match",
    "confirmPasswordError",
    confirmPassword,
    validateConfirmPassword
  )
);
