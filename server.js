import express from 'express'
import mysql2 from 'mysql2';
const app = express();
const port = 3000;
import cors from 'cors'

app.use(cors());
// this express.json needs to be used to access body
app.use(express.json())

const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"mysql123",
    database:"timetracker",
    //node mysql module casts  all mysql date/datetime data types into JS date objects
    //hence dateStrings: true to prevent it from using datetime format on return
    dateStrings: true 
})

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
/*******************************************************************************************************************push_time************************************************************************************************************************************************** */
app.post('/stop', (req, res) => {
    
    if (interval) {
        clearInterval(interval); // Stop the interval if it's running
        interval = null; // Reset the interval variable
        const elapsedSeconds = seconds; // Store the elapsed seconds
        
        seconds = 0; // Reset the seconds counter


        //MYSQL Query
         //DATETIME values in 'YYYY-MM-DD hh:mm:ss'
        let datetime = new Date();


        const   q = "INSERT INTO userdata (`seconds`, `UserID`, `date`) VALUES (?)"

        const values = [elapsedSeconds, 1, datetime.toISOString().slice(0, 10)]

        db.query(q, [values], (err, data)=> {
            if (err) return res.json(err)
            return res.send(`Continuous function stopped. Seconds elapsed: ${elapsedSeconds}`)
        })

    } else {
        res.send('Continuous function is not running.');
    }
});

app.get('/retrieve', (req, res) => {
        // UserID retrieve search
        const q = "SELECT * FROM userdata WHERE UserID=1"

        db.query(q, (err, data)=> {
            if (err) return res.json(err)
            return res.send(data)
        })
    
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

// deleted data history of 1 user
app.delete("/history/:id", (req, res)=> {
    const DataID = req.params.id;
    const q = "DELETE FROM userdata WHERE DataID = ?";

    db.query(q, [DataID], (err, data) => {
        if (err) return res.json(err)
        return res.json("time history has been successfully deleted")
    })
})

app.put("/history/:id", (req, res)=> {
    const DataID = req.params.id;
    console.log(req.body)
    const q = "UPDATE userdata SET `seconds` = ? WHERE DataID = ?";

    const values = [
        req.body.seconds
    ]

   

    db.query(q, [...values, DataID], (err, data) => {
        if (err) return res.json(err)
        return res.json("book has been updated successfully.")
    })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
