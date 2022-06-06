'use strict' // restricts to var and let

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const res = require('express/lib/response')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes
app.get('/', function(req, res) {
    res.send("Hi! I am a chatbot!")
})

app.get('/privacy_notice/', function(req, res) {
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = 'privacy_notice.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });

})


let token = "INSERT API TOKEN HERE" // INSERT API TOKEN FROM FACEBOOK DEVELOPER
// Facebook
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === "INSERT VERIFICATION TOKEN HERE"){ // INSERT VERIFICATION TOKEN OVER HERE. YOU CREATE YOUR OWN
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; ++i){
        let event = messaging_events[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text.toLowerCase()
            if (text === "website"){
                sendText(sender, "Here's the link to our website: " + "https://ellensburgpandagarden.com/")
            } else if (text === "hours"){
                sendText(sender, hours())
            } else if (text === "menu"){
                sendText(sender, "Check out our Menu on our website! \n https://ellensburgpandagarden.com/")
            } else if (text === "phone number"){
                sendText(sender, "Call us at (509) 925-2090!")
            } else if (text === 'other'){
                sendText(sender, "What would you like to ask us? ")
            }
            else{
                sendText(sender, displayOptions())
            }
        }
    }
    res.sendStatus(200)
})


function hours(){
    let hoursOpen = "";
    hoursOpen += "Monday: 11am - 10pm \n";
    hoursOpen += "Tuesday: Closed \n";
    hoursOpen += "Wednesday: 11am - 10pm \n";
    hoursOpen += "Thursday: 11am - 10pm \n";
    hoursOpen += "Friday: 11am - 11pm \n";
    hoursOpen += "Saturday: 12pm - 11pm \n";
    hoursOpen += "Sunday: 12pm - 10pm \n";

    return hoursOpen;
}

function displayOptions(){
    let options = "";
    options += "Hi there! I am Panda Garden's automated messages. How may I help you today? \n \n";
    options += "Type 'Hours' to see when we are open \n";
    options += "Type 'Menu' to see our menu on our website \n";
    options += "Type 'Website' to see our website \n";
    options += "Type 'Phone Number' to see our phone number \n";
    options += "If there isn't any options you are looking for, type in your question and we will get back to you shortly \n";

    return options;
}

function sendText(sender, text) {
    let messageData = {text: text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token : token},
        method: "POST",
        json: {
            recipient : {id: sender},
            message : messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Sending error")
        } else if (response.body.error) {
            console.log("Response body error")
        }
    })
}


app.listen(app.get('port'), function() {
    console.log("Running: port")
})