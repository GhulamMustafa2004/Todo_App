import {
  signOut,
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const dataBase = getFirestore();

let logOut = document.getElementById("logOutBtn");
let welComeMsg = document.getElementById("welcomeText");
let addBtn = document.getElementById("addBtn");
let addTodo = document.getElementById("addTodo");

let todoData;

loaderShow();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const logInUserDoc = await getDoc(
        doc(collection(dataBase, "users"), user.uid)
      );
      const logInUser = logInUserDoc.data();
      if (logInUser) {
        loaderHide();
        welComeMsg.innerHTML = `Welcome ${logInUser.userName}`;
      } else {
        loaderHide();
        console.log("User data not found");
      }
    } catch (error) {
      console.error(error, ">error");
    }
  } else {
    window.location.href = "/auth/Login/index.html";
  }
});

logOut.addEventListener("click", (event) => {
  event.preventDefault();
  loaderShow();
  signOut(auth)
    .then(() => {
      window.location.href = "/auth/Login/index.html";
    })
    .catch((error) => {
      loaderHide();
      console.log(error, ">error");
    });
});

addBtn.addEventListener("click", (event) => {
  event.preventDefault();
  loaderShow();
  addDoc(collection(dataBase, "todos"), {
    todoData,
  })
    .then(() => {
      loaderHide();
      addTodo.value = "";
    })
    .catch((error) => {
      console.log(error, ">error");
    });
});

addBtn.classList.add("disableBtn");
addTodo.addEventListener("input", () => {
  todoData = addTodo.value;
  if (todoData) {
    addBtn.classList.remove("disableBtn");
  } else {
    console.log(">error");
  }
});
