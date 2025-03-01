document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const error = document.getElementById('error');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (formValidation()) {
            submitForm();
        }
    });

    function formValidation() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        error.textContent = '';

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (name === '') {
            error.textContent = 'Please Enter Your Name!';
            return false;
        }
        if (email === '') {
            error.textContent = 'Please Enter Your Email ID!';
            return false;
        } else if (!emailPattern.test(email)) {
            error.textContent = 'Please Enter A Valid Email ID!';
            return false;
        }
        if (message === '') {
            error.textContent = 'Enter Some Message!';
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
                    error.textContent = 'Form submitted successfully';
                } else {
                    console.log(response);
                    error.textContent = json.message;
                }
            })
            .catch((err) => {
                console.log(err);
                error.textContent = 'Something went wrong!';
            })
            .then(() => {
                form.reset();
                setTimeout(() => {
                    error.textContent = '';
                }, 3000);
            });
    }
});
