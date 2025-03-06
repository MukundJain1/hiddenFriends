// signup.js
import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { showMessage } from "../../../functions/showMes.js";

// Import Firestore functions
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const submitButton = document.getElementById("create");
  const loadingIndicator = document.getElementById("loading-indicator");
  const usernameInput = document.getElementById("username");
  const usernameFeedback = document.getElementById("username-feedback");

  if (!form) {
    console.error("Signup form not found!");
    return;
  }
  
  usernameInput.addEventListener("input", async () => {
    const uname = usernameInput.value.trim().toLowerCase();
    if (uname.length < 4) {
      usernameFeedback.textContent = "Username must be at least 4 characters.";
      usernameFeedback.classList.remove("text-green-500");
      usernameFeedback.classList.add("text-red-500");
      return;
    }
    const usernameDoc = doc(db, "usernames", uname);
    try {
      const docSnap = await getDoc(usernameDoc);
      if (docSnap.exists()) {
        usernameFeedback.textContent = "Username is taken.";
        usernameFeedback.classList.remove("text-green-500");
        usernameFeedback.classList.add("text-red-500");
      } else {
        usernameFeedback.textContent = "Username is available.";
        usernameFeedback.classList.remove("text-red-500");
        usernameFeedback.classList.add("text-green-500");
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  });

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input values
    const username = usernameInput.value.trim().toLowerCase();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rePassword = document.getElementById("re-password").value.trim();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Validate inputs
    if (!username) {
      showMessage("Please enter a username!", "error");
      return;
    } else if (username.length < 4) {
      showMessage("Username must be at least 4 characters.", "error");
      return;
    } else {
      // Check if username already exists
      const usernameDocRef = doc(db, "usernames", username);
      const docSnap = await getDoc(usernameDocRef);
      if (docSnap.exists()) {
        showMessage("Username is already taken. Please choose another.", "error");
        return;
      }
    }
    
    if (!email) {
      showMessage("Please enter your email!", "error");
      return;
    } else if (!emailPattern.test(email)) {
      showMessage("Please enter a valid Gmail ID!", "error");
      return;
    }
    if (!password || !rePassword) {
      showMessage("Please create your password!", "error");
      return;
    } else if (password !== rePassword) {
      showMessage("Passwords do not match!", "error");
      return;
    } else if (password.length < 6) {
      showMessage("Password should have at least 6 characters.", "error");
      return;
    }

    // Disable inputs and show loading
    form.querySelectorAll('input').forEach(input => input.disabled = true);
    submitButton.disabled = true;
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with the username
      await updateProfile(user, { displayName: username });

      // Save the username mapping in Firestore (in collection "usernames")
      await setDoc(doc(db, "usernames", username), {
        uid: user.uid,
        createdAt: serverTimestamp(),
        email : user.email
      });

      // Define action code settings for email verification redirect.
      // Make sure to add "127.0.0.1" (or your domain) in Firebase console under Authorized Domains.
      const actionCodeSettings = {
        url:"http://127.0.0.1:5500/src/components/homepage/index.html",
        handleCodeInApp: true,
      };

      // Send email verification
      await sendEmailVerification(user, actionCodeSettings);
      showMessage("Account created! Please check your email for verification.", "success");
      form.reset();
      setTimeout(()=>{
        window.location.replace("../../../index.html");
      }, 2000);
      
    } catch (error) {
      showMessage(error.message, "error");
      console.error("Error during sign-up:", error);
    } finally {
      // Re-enable inputs and hide loading indicator
      form.querySelectorAll('input').forEach(input => input.disabled = false);
      submitButton.disabled = false;
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
  });
});
