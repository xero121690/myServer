const express = require('express');
const app = express();
const port = 3000;
var cors = require('cors');

app.use(cors());

let interval; // Declare the interval variable
let seconds = 0; // Initialize seconds counter
let totalTime;

// Your continuous function
function myContinuousFunction() {
    seconds++; // Increment the seconds counter
    console.log(`Seconds elapsed: ${seconds}`);
    totalTime = seconds;
}

// Route to start the continuous function
app.get('/start', (req, res) => {
    if (!interval) {
        interval = setInterval(myContinuousFunction, 1000); // Start the interval if it's not already running (every 1 second)
        // no need to send anything - like it but might delete later
        res.send('Continuous function started.');
    } else {
        res.send('Continuous function is already running.');
    }
});

// Route to stop the continuous function and return the seconds elapsed
app.get('/stop', (req, res) => {
    if (interval) {
        clearInterval(interval); // Stop the interval if it's running
        interval = null; // Reset the interval variable
        const elapsedSeconds = seconds; // Store the elapsed seconds
        
        seconds = 0; // Reset the seconds counter
        res.send(`Continuous function stopped. Seconds elapsed: ${elapsedSeconds}`);
    } else {
        res.send('Continuous function is not running.');
    }
});

app.get('/retrieve', (req, res) => {
        res.send(`${totalTime}`);
});


//have to check on refresh
app.get('/onrefresh', (req, res) => {
    console.log(interval);
    // if interval running, stop button appears
    if (interval) {
        res.send(true);
    } else {
        res.send(false);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
