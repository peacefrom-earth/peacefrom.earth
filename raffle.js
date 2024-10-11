// Base URL for the API
const BASE_URL = 'https://peacefrom.earth';

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Function to create a participant entry form
    function createParticipantForm() {
        const container = document.getElementById('raffle-container');
        
        // Create form elements
        const form = document.createElement('form');
        const emailInput = document.createElement('input');
        const wishInput = document.createElement('input');
        const submitButton = document.createElement('button');

        // Set attributes for email input
        emailInput.type = 'email';
        emailInput.id = 'participantEmail';
        emailInput.placeholder = 'Enter your email';
        emailInput.required = true;

        // Set attributes for wish input
        wishInput.type = 'text';
        wishInput.id = 'participantWish';
        wishInput.placeholder = 'Enter your wish';
        wishInput.required = true;

        // Set attributes for submit button
        submitButton.type = 'submit';
        submitButton.textContent = 'Enter Raffle';

        // Append elements to form
        form.appendChild(emailInput);
        form.appendChild(wishInput);
        form.appendChild(submitButton);

        // Add form to the container
        container.appendChild(form);

        // Add form submission event listener
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = emailInput.value.trim();
            const wish = wishInput.value.trim();
            if (email && wish) {
                try {
                    const result = await addEntry(email, wish);
                    if (result.message === 'Entry added successfully') {
                        emailInput.value = '';
                        wishInput.value = '';
                        alert('You have been entered into the raffle!');
                    } else {
                        alert('Failed to add entry. Please try again.');
                    }
                } catch (error) {
                    console.error('Error adding entry:', error);
                    alert('An error occurred. Please try again.');
                }
            } else {
                alert('Please enter a valid email address and make a wish.');
            }
        });
    }

    // Call the function to create the form
    createParticipantForm();

    console.log("Raffle system initialized.");
});

// Fetch functions for API calls
async function login(username, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

async function verify2FA(token) {
    const response = await fetch(`${BASE_URL}/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    return response.json();
}

async function addEntry(email, wish) {
    const response = await fetch(`${BASE_URL}/add-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, wish })
    });
    return response.json();
}

async function drawWinner() {
    const response = await fetch(`${BASE_URL}/draw-winner`);
    return response.json();
}

async function exportCSV() {
    const response = await fetch(`${BASE_URL}/export-csv`);
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'raffle_entries.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        console.error('Failed to export CSV');
    }
}
