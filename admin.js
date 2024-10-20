const SERVER_URL = 'https://wish-clow-production.up.railway.app'; // Adjust this if your server is running on a different port

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login');
    const twoFAForm = document.getElementById('verify2FA');
    const adminPanel = document.getElementById('adminPanel');
    const drawWinnerBtn = document.getElementById('drawWinnerBtn');
    const exportCSVBtn = document.getElementById('exportCSVBtn');
    const winnerDisplay = document.getElementById('winnerDisplay');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const result = await login(username, password);
            if (result.message === 'Login successful, please enter 2FA code') {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('twoFAForm').style.display = 'block';
            } else {
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    twoFAForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const token = document.getElementById('totpToken').value;
        try {
            const result = await verify2FA(token);
            if (result.message === '2FA verified') {
                document.getElementById('twoFAForm').style.display = 'none';
                adminPanel.style.display = 'block';
            } else {
                alert('2FA verification failed. Please try again.');
            }
        } catch (error) {
            console.error('2FA verification error:', error);
            alert('An error occurred during 2FA verification. Please try again.');
        }
    });

    drawWinnerBtn.addEventListener('click', async function() {
        try {
            const result = await drawWinner();
            if (result.winner) {
                winnerDisplay.textContent = `Winner: ${result.winner.email} - Wish: ${result.winner.wish}`;
            } else {
                winnerDisplay.textContent = 'No entries found.';
            }
        } catch (error) {
            console.error('Draw winner error:', error);
            alert('An error occurred while drawing a winner. Please try again.');
        }
    });

    exportCSVBtn.addEventListener('click', async function() {
        try {
            await exportCSV();
        } catch (error) {
            console.error('Export CSV error:', error);
            alert('An error occurred while exporting CSV. Please try again.');
        }
    });
});

async function login(username, password) {
    const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

async function verify2FA(token) {
    const response = await fetch('/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    return response.json();
}

async function drawWinner() {
    const response = await fetch('/draw-winner');
    return response.json();
}

async function exportCSV() {
    const response = await fetch('/export-csv');
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
        throw new Error('Failed to export CSV');
    }
}
