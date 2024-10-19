const SERVER_URL = 'https://wish-clow-production.up.railway.app';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login');
    const twoFAContainer = document.getElementById('twoFAContainer');
    const verify2FAForm = document.getElementById('verify2FA');
    const adminPanel = document.getElementById('adminPanel');
    const drawWinnerBtn = document.getElementById('drawWinnerBtn');
    const exportCSVBtn = document.getElementById('exportCSVBtn');
    const winnerDisplay = document.getElementById('winnerDisplay');
    const errorMessageElement = document.getElementById('errorMessage');

    function displayError(message) {
        errorMessageElement.textContent = message;
    }

    function clearError() {
        errorMessageElement.textContent = '';
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        clearError();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            console.log('Attempting login...');
            const result = await login(username, password);
            console.log('Login result:', result);
            if (result.message === 'Login successful, please enter 2FA code') {
                document.getElementById('loginForm').style.display = 'none';
                console.log('Requesting 2FA setup...');
                const setupResult = await setup2FA();
                console.log('2FA setup result:', setupResult);
                if (setupResult.qrCodeUrl) {
                    console.log('QR Code URL received:', setupResult.qrCodeUrl);
                    document.getElementById('qrCodeImage').src = setupResult.qrCodeUrl;
                    twoFAContainer.style.display = 'block';
                } else {
                    console.error('No QR Code URL in setup result');
                    displayError('Failed to get QR Code. Please try again.');
                }
            } else {
                console.error('Login failed:', result.message);
                displayError('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            displayError('An error occurred during login. Please try again.');
        }
    });

    verify2FAForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        clearError();
        const token = document.getElementById('totpToken').value;
        try {
            const result = await verify2FA(token);
            if (result.message === '2FA verified') {
                twoFAContainer.style.display = 'none';
                adminPanel.style.display = 'block';
            } else {
                displayError('2FA verification failed. Please try again.');
            }
        } catch (error) {
            console.error('2FA verification error:', error);
            displayError('An error occurred during 2FA verification. Please try again.');
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
    console.log('Sending login request to:', `${SERVER_URL}/login`);
    const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    console.log('Login response status:', response.status);
    return response.json();
}

async function setup2FA() {
    console.log('Sending 2FA setup request to:', `${SERVER_URL}/setup-2fa`);
    const response = await fetch(`${SERVER_URL}/setup-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    console.log('2FA setup response status:', response.status);
    return response.json();
}

async function verify2FA(token) {
    console.log('Sending 2FA verification request to:', `${SERVER_URL}/verify-2fa`);
    const response = await fetch(`${SERVER_URL}/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    console.log('2FA verification response status:', response.status);
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
