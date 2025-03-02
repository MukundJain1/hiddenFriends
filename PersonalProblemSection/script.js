document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const error = document.getElementById('error');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (formValidation()) {
            submitForm();
        }
    });

    function formValidation(event) {
        var category = document.getElementById("category").value;
        var otherCategory = document.getElementById("other-category").value.trim();
        var message = document.getElementById("message").value.trim();
        var errorDiv = document.getElementById("error");
        errorDiv.innerHTML = "";

        if (category === "other" && otherCategory === "") {
            errorDiv.innerHTML = "Please specify your problem in the 'Other' category.";
            event.preventDefault();
            return false;
        }
        if (message === "") {
            errorDiv.innerHTML = "Please describe your problem.";
            event.preventDefault();
            return false;
        }
        return true;
    }

    function submitForm() {
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        error.textContent = 'Please wait...';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: json,
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    error.textContent = '✅ Form submitted successfully!';
                    error.classList.remove('text-red-500');
                    error.classList.add('text-green-500');
                } else {
                    console.log(response);
                    error.textContent = json.message;
                }
            })
            .catch((err) => {
                console.log(err);
                error.textContent = '❌ Something went wrong!';
            })
            .then(() => {
                form.reset();
                setTimeout(() => {
                    error.textContent = '';
                    error.classList.remove('text-green-500');
                    error.classList.add('text-red-500');
                }, 3000);
            });
    }
});
