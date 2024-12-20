const BASE_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:3000' // Local backend
        : 'hhttps://thermostat-git-main-alapp1s-projects.vercel.app;// Vercel backend


// Login button click event
document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the server
    fetch('${BASE_URL}/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            // Hide login section and show control section if login is successful
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('controlSection').style.display = 'block';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('An error occurred during login. Please check your network connection.');
    });
});

// Cool button click event
document.getElementById('coolButton').addEventListener('click', () => {
    sendCommand('cool');
});

// Off button click event
document.getElementById('offButton').addEventListener('click', () => {
    sendCommand('off');
});

// Function to send command to the server
function sendCommand(command) {
    fetch('/setThermostat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('status').innerText = `Status: Command "${command}" sent successfully.`;
        } else {
            throw new Error('Failed to send command');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('status').innerText = 'Status: Error sending command.';
    });
}

// Schedule functionality
document.getElementById('addCoolTimeButton').addEventListener('click', () => {
    const coolTime = document.getElementById('coolTimeInput').value;
    if (coolTime) {
        addSchedule('cool', coolTime);
    }
});

document.getElementById('addOffTimeButton').addEventListener('click', () => {
    const offTime = document.getElementById('offTimeInput').value;
    if (offTime) {
        addSchedule('off', offTime);
    }
});
function registerUser(username, password) {
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            if (response.ok) {
                alert('User registered successfully');
            } else {
                alert('Failed to register user');
            }
        })
        .catch(error => {
            console.error('Error registering user:', error);
            alert('An error occurred');
        });
}

// Function to add a schedule
function addSchedule(command, time) {
    // Determine which list to add to
    const list = command === 'cool' ? document.getElementById('coolTimesList') : document.getElementById('offTimesList');

    // Prevent duplication by checking if the time already exists in the list
    const existingItems = Array.from(list.children);
    if (existingItems.some(item => item.dataset.time === time)) {
        console.log('This schedule already exists.');
        return; // Stop the function if the time is already scheduled
    }

    // Create list item
    const listItem = document.createElement('li');
    listItem.dataset.time = time; // Store time in dataset for easier removal lookup
    listItem.textContent = `${time} `;

    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-button');

    // Add click event listener to the remove button
    removeButton.addEventListener('click', () => {
        list.removeChild(listItem);
        removeSchedule(command, time);
    });

    // Append remove button to list item
    listItem.appendChild(removeButton);

    // Add list item to the respective list
    list.appendChild(listItem);

    // Send the schedule to the backend only after adding to the UI
    fetch('${BASE_URL}/setSchedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command, time: time })
    })
    .then(response => {
        if (response.ok) {
            console.log(`Scheduled ${command} at ${time}`);
        } else {
            console.error('Failed to schedule time');
        }
    })
    .catch(error => {
        console.error('Error scheduling time:', error);
    });
}

// Function to remove a schedule
function removeSchedule(command, time) {
    // Send a request to the backend to remove the schedule
    fetch('${BASE_URL}/removeSchedule', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command, time: time })
    })
    .then(response => {
        if (response.ok) {
            console.log(`Removed ${command} at ${time}`);
        } else {
            console.error('Failed to remove schedule');
        }
    })
    .catch(error => {
        console.error('Error removing schedule:', error);
    });
}

