export function showMessage(message, type) {
    const messageBox = document.getElementById("message-box");
    const messageContainer = document.getElementById("message-container");
    const messageText = document.getElementById("message-text");
    const iconSuccess = document.getElementById("icon-success");
    const iconError = document.getElementById("icon-error");
  
    // Check that required elements exist
    if (!messageBox || !messageContainer || !messageText || !iconSuccess || !iconError) {
      console.error("One or more message elements not found in the DOM!");
      return;
    }
  
    // Update message text
    messageText.textContent = message;
  
    // Hide both icons initially
    iconSuccess.classList.add("hidden");
    iconError.classList.add("hidden");
  
    // Remove previous color classes from container
    messageContainer.classList.remove("bg-green-700", "bg-red-700");
  
    // Show appropriate icon and set background color
    if (type === "success" || type === "created") {
      iconSuccess.classList.remove("hidden");
      messageContainer.classList.add("bg-green-700");
    } else {
      iconError.classList.remove("hidden");
      messageContainer.classList.add("bg-red-700");
    }
  
    // Show the message box
    messageBox.classList.remove("hidden", "opacity-0");
    messageBox.classList.add("opacity-100");
  
    // Hide after 3 seconds
    setTimeout(() => {
      messageBox.classList.remove("opacity-100");
      messageBox.classList.add("opacity-0");
  
      // Fully hide after transition
      setTimeout(() => {
        messageBox.classList.add("hidden");
      }, 500);
    }, 3000);
  }
  