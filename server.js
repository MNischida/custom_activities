const express = require('express')
const server = express()
const configJSON = require('./public/config/config-json.js')
const port = process.env.PORT || 3333;
const axios = require('axios');
const bodyParser = require('body-parser');
const JWT = require('./public/js/jwtDecoder.js')
require('dotenv').config()

// Set engine
server.set('view engine', 'ejs');

// Static
server.use(express.static('public'));

// Body parser
server.use(express.urlencoded({ extended: true }));
server.use(express.json())
server.use(bodyParser.raw({
    type: 'application/jwt'
}))

server.get('/', (req, res) => {
    res.redirect('/index.html')
})

server.get('/index.html', (req, res) => {
    res.render('./index.ejs')
})

// Return JSON
server.get('/config.json', (req, res) => {
    res.status(200).json(configJSON(req));
});

// Return JWT
server.get('/jwt.js', (req, res) => {
    res.status(200).json(JWT(req));
});

// customActivity
server.get('/customActivity.js', (req, res) => {
    res.redirect('js/customActivity.js');
});


// ```````````````````````````````````````````````````````
// BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
//
// CONFIGURATION
// ```````````````````````````````````````````````````````
// Reference:
// https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm


/**
 * Called when a journey is saving the activity.
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/save', function(req, res) {
    console.log('debug: /save');
    return res.status(200).json({});
});

/**
 * Called when a Journey has been published.
 * This is when a journey is being activiated and eligible for contacts
 * to be processed.
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/publish', function(req, res) {
    console.log('debug: /publish');
    return res.status(200).json({});
});

/**
 * Called when a Journey has been unpublished.
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/unpublish', function(req, res) {
    console.log('debug: /unpublish');
    return res.status(200).json({});
});

/**
 * Called when Journey Builder wants you to validate the configuration
 * to ensure the configuration is valid.
 * @return {[type]}
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/validate', function(req, res) {
    console.log('debug: /validate');
    return res.status(200).json({});
});


// ```````````````````````````````````````````````````````
// BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
//
// EXECUTING JOURNEY
// ```````````````````````````````````````````````````````

/**
 * Called when a Journey is stopped.
 * @return {[type]}
 */
server.post('/stop', function(req, res) {
    console.log('debug: /stop');
    return res.status(200).json({});
});

/**
 * Called when a contact is flowing through the Journey.
 * @return {[type]}
 * 200 - Processed OK
 * 3xx - Contact is ejected from the Journey.
 * 4xx - Contact is ejected from the Journey.
 * 5xx - Contact is ejected from the Journey.
 */
server.post('/execute', function(req, res) {
    console.log('debug: /execute');

    const request = JWT(req.body);

    const url = 'https://eo8qif9pyzfou2p.m.pipedream.net'

    // Find the in argument
    function getInArgument(k) {
        if (request && request.inArguments) {
            for (let i = 0; i < request.inArguments.length; i++) {
                let e = request.inArguments[i];
                if (k in e) {
                    return e[k];
                }
            }
        }
    }

    const payload = request.inArguments;
    const headers = {
        'Content-Type': 'application/json'
    }

    const inArguments = request.inArguments

    console.log('Request InArgument: ' + JSON.stringify(request.inArguments));

    var selectedValue = null;

    for (var i = 0; i < inArguments.length; i++) {
        if ("selected" in inArguments[i]) {
            selectedValue = inArguments[i].selected;
        }
    }

    console.log('valor selecionado: ' + selectedValue);

    if (selectedValue === 'httprequest') {
        axios
        .post(url, payload, {
            headers: headers
        })
        .then(resp => {
            return res.status(200).json(resp.data);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json(error);
        })
    } else if (selectedValue === 'sms') {
        console.log('SMS enviado');
    }
    


    

    return res.status(200).json({});
});


server.listen(port, '0.0.0.0', () => {
    console.log(`App listening at port ${port}`);
})