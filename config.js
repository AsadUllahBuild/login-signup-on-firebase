
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAmx2398XR9ZzgFBb9qKkXRU1Vx0wzSYdA",
    authDomain: "login-signup-form-e7239.firebaseapp.com",
    projectId: "login-signup-form-e7239",
    storageBucket: "login-signup-form-e7239.appspot.com",
    messagingSenderId: "514292437961",
    appId: "1:514292437961:web:288901265733f40deace18",
    measurementId: "G-BVBSXGSHQ9"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);