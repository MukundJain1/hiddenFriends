// signIn.js
import { auth } from "/src/components/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { showMessage } from "/functions/showMes.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("signin-form");
    const submitButton = document.getElementById("signin");
    const loadingIndicator = document.getElementById("loading-indicator");

    form.addEventListener("submit", async (e) => {
        // Prevent the default form submission (page refresh)
        e.preventDefault();

        // Get the username and password from the inputs
        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        if (!username) {
            showMessage("Please enter your username!", "error");
            return;
        }
        if (!password) {
            showMessage("Please enter your password!", "error");
            return;
        }

        // Disable inputs and show loading indicator
        form.querySelectorAll("input").forEach((input) => (input.disabled = true));
        submitButton.disabled = true;
        if (loadingIndicator) loadingIndicator.style.display = "block";

        try {
            // Look up the username document in Firestore
            const usernameDocRef = doc(db, "usernames", username);
            console.log(usernameDocRef);
            const docSnap = await getDoc(usernameDocRef);
            if (!docSnap.exists()) {
                showMessage("Username not found.", "error");
                return;
            }

            // Retrieve the stored email from the document
            const userData = docSnap.data();
            const email = userData.email;
            if (!email) {
                showMessage("No email associated with this username.", "error");
                console.log("email error");
                return;
            }

            // Sign in using the retrieved email and provided password
            await signInWithEmailAndPassword(auth, email, password);
            showMessage("Signed in successfully!", "success");

            // Redirect to homepage after a brief delay
            setTimeout(() => {
                window.location.replace("src/components/homepage/index.html");
            }, 2000);
        } catch (error) {
            showMessage(error.message, "error");
            console.error("Error signing in:", error);
        } finally {
            // Re-enable form inputs and hide the loading indicator
            form.querySelectorAll("input").forEach((input) => (input.disabled = false));
            submitButton.disabled = false;
            if (loadingIndicator) loadingIndicator.style.display = "none";
        }
    });
})

