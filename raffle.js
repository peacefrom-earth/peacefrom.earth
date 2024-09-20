// Wait for the DOM to be fully loaded before running the script
// Restrict participants to email addresses only
document.addEventListener('DOMContentLoaded', function() {
    // Function to create a participant entry form and pick winner button
    function createParticipantFormAndPickWinnerButton() {
        const container = document.getElementById('raffle-container');
        
        // Create form elements
        const form = document.createElement('form');
        const nameInput = document.createElement('input');
        const submitButton = document.createElement('button');
        const pickWinnerButton = document.createElement('button');
        const wishInput = document.createElement('input');

        // Change input type to email and update placeholder
        nameInput.type = 'email';
        nameInput.id = 'participantEmail';
        nameInput.placeholder = 'Enter participant email';
        nameInput.required = true;

        // Set attributes for submit button
        submitButton.type = 'submit';
        submitButton.textContent = 'Add Participant';

        // Set attributes for pick winner button
        pickWinnerButton.type = 'button';
        pickWinnerButton.textContent = 'Pick Winner';
        pickWinnerButton.addEventListener('click', function() {
            const winner = drawWinner();
            if (winner) {
                const [email, wish] = winner;
                console.log(`The winner is: ${email} with the wish: ${wish}`);
                alert(`The winner is: ${email}\nTheir wish: ${wish}`);
            } else {
                console.log("No participants in the raffle.");
                alert("No participants in the raffle.");
            }
        });

        // Append elements to form
        form.appendChild(nameInput);
        form.appendChild(wishInput);
        form.appendChild(submitButton);
        form.appendChild(pickWinnerButton);

        // Add form to the container
        container.appendChild(form);

        // Update form submission event listener
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = nameInput.value.trim();
            const wish = wishInput.value.trim();
            if (email && wish && emailRepo.isValidEmail(email)) {
                if (addParticipant(email, wish)) {
                    nameInput.value = '';
                    wishInput.value = '';
                } else {
                    alert('This email has already been entered.');
                }
            } else {
                alert('Please enter a valid email address and make a wish.');
            }
        });
    }

    // Call the function to create the form and pick winner button
    createParticipantFormAndPickWinnerButton();

    // Add this class at the beginning of your file
    class EmailRepository {
        constructor() {
            this.participants = new Map();
        }

        add(email, wish) {
            email = email.toLowerCase();
            if (this.isValidEmail(email)) {
                if (this.participants.has(email)) {
                    return false; // Email already exists
                }
                this.participants.set(email, wish);
                return true;
            }
            return false;
        }

        remove(email) {
            return this.participants.delete(email.toLowerCase());
        }

        getAll() {
            return Array.from(this.participants.entries());
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }

    // Replace the participants array with EmailRepository
    const emailRepo = new EmailRepository();

    // Update addParticipant function
    function addParticipant(email, wish) {
        if (emailRepo.add(email, wish)) {
            console.log(`${email} has been added to the raffle with the wish: ${wish}`);
            return true;
        } else {
            console.log(`Failed to add ${email} to the raffle.`);
            return false;
        }
    }

    // Update removeParticipant function
    function removeParticipant(email) {
        if (emailRepo.remove(email.toLowerCase())) {
            console.log(`${email} has been removed from the raffle.`);
        } else {
            console.log(`${email} is not in the raffle.`);
        }
    }

    // Update drawWinner function
    function drawWinner() {
        const participants = emailRepo.getAll();
        if (participants.length === 0) {
            return null;
        }
        const winnerIndex = Math.floor(Math.random() * participants.length);
        return participants[winnerIndex];
    }
});
