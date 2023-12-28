import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();
const auth = getAuth();
const dataBase = getFirestore();

let email = document.getElementById("email");
let password = document.getElementById("password");
let googleLogin = document.getElementById("googleLogIn");
let signupPage = document.getElementById("signupPage");
let logInContinue = document.getElementById("logIn");

let userEmail = "";
let userPassword = "";
let authStateChanged = 0;

signupPage.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/auth/Signup/index.html";
});

// loaderShow();
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

googleLogin.addEventListener("click", () => {
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

logInContinue.addEventListener("click", (event) => {
  event.preventDefault();
  loaderShow();
  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(() => {
      window.location.href = "/dashBoard/index.html";
      loaderHide();
    })
    .catch((error) => {
      loaderHide();
      console.log(error, "error");
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

let btnDissable = () => {
  logInContinue.classList.add("disableBtn");
  if (userEmail && userPassword) {
    if (!/\S+@\S+/.test(userEmail)) {
    } else if (!(userPassword.length >= 6)) {
    } else {
      logInContinue.classList.remove("disableBtn");
    }
  }
};

let validateEmail = (value) => {
  userEmail = value;
  btnDissable();
  return /\S+@\S+/.test(value);
};
let validatePassword = (value) => {
  userPassword = value;
  btnDissable();
  return value.length >= 6;
};

email.addEventListener("input", () =>
  inputlistener(event, "Must include @", "emailError", email, validateEmail)
);
password.addEventListener("input", () =>
  inputlistener(
    event,
    "Min. 6 letter required",
    "passwordError",
    password,
    validatePassword
  )
);
