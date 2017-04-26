'use strict';

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/getUserData/', function (req, res) {
	console.log('getUserData request....................');
    	console.log("getUserData json === ");
	console.log(JSON.stringify(req.body));
	var action = req.body.result.action;
	console.log("action");
	console.log(action);
	if(action != null &&  action != '' &&  action != undefined){
		request({
			url : "http://72.55.146.142:9091/chatbot/rest/Chatbot/"+action,
			method : "POST",
			headers : { "Content-Type" : "application/json"},
			body : JSON.stringify(req.body),
			json: true
		    },
		    function (error, resp, body) {
			if (error) {
				console.log('in getUserData Error sending messages: ', error);
			}else{
				console.log("in getUserData else response block............");
				console.log(body);
				return res.json({
				    speech: body,
				    displayText: body,
				    source: 'r2goyal/apiai_nodejs'
				});
			}
		    }
		);
	}else{
		return res.json({
				    speech: "some problem in fetching data",
				    displayText: "some problem in fetching data",
				    source: 'r2goyal/apiai_nodejs'
				});
	}
	
	

// 	    request({
// 				url: 'http://72.55.146.142:9091/chatbot/rest/Chatbot/getUserData',
// 				method: 'POST',
// 		    		json: true,
// 		    		body: req.body,
// 				async:false
// 				}, function(error, response, body) {
// 				if (error) {
// 					console.log('in getUserData Error sending messages: ', error);
// 				}else{
// 					console.log("in getUserData else response block............");
// 					console.log(response);
// 					//console.log(response.body);
// 					return res.json({
// 					    speech: response.body,
// 					    displayText: response.body,
// 					    source: 'r2goyal/apiai_nodejs'
// 					});
// 				}
// 			})	
	
});

restService.post('/webhookToChatbot/', function (req, res) {

    console.log('webhookToChatbot request....................');
    console.log("request json === ");
	 console.log(JSON.stringify(req.body));
 
    try {
//         var speech = 'empty speech';
        if (req.body) {
//             var requestBody = req.body;

//             if (requestBody.result) {
//                 speech = '';

//                 if (requestBody.result.fulfillment) {
//                     speech += requestBody.result.fulfillment.speech;
//                     speech += ' ';
//                 }

//                 if (requestBody.result.action) {
//                     speech += 'action: ' + requestBody.result.action;
//                 }
//             }
             console.log("Text : "+req.body.result.resolvedQuery);
            request({
				url: 'http://72.55.146.142:9091/chatbot/rest/Chatbot/getResponse?request='+req.body.result.resolvedQuery,
				method: 'GET',
				async:false
				}, function(error, response, body) {
				if (error) {
					console.log('Error sending messages: ', error)
				}else{
					console.log("in else response block............");
					console.log(response.body);
					return res.json({
					    speech: response.body,
					    displayText: response.body,
					    source: 'r2goyal/apiai_nodejs'
					});
				}
			})
        }       
    } catch (err) {
        console.error("Can't process request for webhookToChatbot ", err);
        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
