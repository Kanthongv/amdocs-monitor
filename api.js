'use strict'

var request = require('request');
var gl = require('./global');
var dbMod = require('./db-module');
var logger = require('./logger');
var fs = require('./file');

/*
  List the status info for each endpoint
*/
exports.list =  function(req, res) {
     res.writeHead(200, {'Content-Type': 'application/json'});

     logger.log.debug("/List: Server endpoint called");

     dbMod.find()

     if (gl.response == '') {
         logger.log.info(">> Response value no set yet");
     }
     res.end(JSON.stringify(gl.response));
}

/*
    Refresh BPT
    requisito : MIME TYPE = application/json
*/
exports.refreshBPT = function(req, res) {
     logger.log.debug("UpdateBPT Called!");

     /*
        { "url": "http://www.google.com"}
     */

     //Check valid mime type
     logger.log.debug("MIME Type: " + req.get('Content-Type'));
     if (!req.is('application/json')) {
         res.end("Invalid MIME type, only valid type is 'application/json'")
         return
     }

     logger.log.debug("Body: " + req.body)

     //The body is already a JSON object

     var endpoint = req.body.url
     if (typeof endpoint == 'undefined' || endpoint == null) {
         logger.log.error("JSON invalid");

         res.end("JSON invalid");
         return
     }

     var requ = request(
         { url: endpoint, //URL to hit
           method: 'POST',
           headers: {
              'Content-Type': 'text/xml',
           },
           body: fs.getRefreshBPTRequest() //Set the body as a string
         }
         , function(error, response_call, body) {
               var status = false;
               var code = 0;
               if (!error && response_call.statusCode == 200) {
                    status = true;
                    code = 200;
               } if (!error) {
                    code = response_call.statusCode;
               } else {
                    status = false;
               }
               logger.log.debug("URL " + endpoint + " is:" + status + " code: " + code + " \n Body:" + body)

               if (error) {
                   res.end("ERROR");
               } else {
                   res.end("OK");
               }
        }
    )
}