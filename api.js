var request = require('request');
var dbMod = require('./db-module');

var requestSync = require('urllib-sync').request;

/*
  List the status info for each endpoint
*/
exports.list =  function(req, res) {
     res.writeHead(200, {'Content-Type': 'application/json'});

     console.log("/List: Server endpoint called");

     dbMod.find()

     if (response == '') {
         console.log(">> Response value no set yet");
     }
     res.end(JSON.stringify(response));
}

/*
    Refresh BPT
    requisito : MIME TYPE = application/json
*/
exports.refreshBPT = function(req, res) {
     console.log("UpdateBPT Called!");

     /*
        { "url": "http://www.google.com"}
     */

     //Check valid mime type
     console.log("MIME Type: " + req.get('Content-Type'));
     if (!req.is('application/json')) {
         res.end("Invalid MIME type, only valid type is 'application/json'")
         return
     }

     console.log("Body: " + req.body)

     //The body is already a JSON object

     var endpoint = req.body.url
     if (typeof endpoint == 'undefined' || endpoint == null) {
         console.log("JSON invalid");
         res.end("JSON invalid");
         return
     }

     // var refreshBody =
     //        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:amd="http://www.movistar.com.ar/ws/schema/amdocs">'
     //        + '<soapenv:Header/>'
     //        + '<soapenv:Body>'
     //        + '<amd:refresh/>'
     //        + '</soapenv:Body>'
     //        + '</soapenv:Envelope>'

     var requ = request(
         { url: endpoint, //URL to hit
           method: 'POST', //Specify the method
           headers: { //We can define headers too
              'Content-Type': 'text/xml',
           },
           body: refreshBPTReq //Set the body as a string
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
               console.log("URL " + endpoint + " is:" + status + " code: " + code + " \n Body:" + body)

               if (error) {
                   res.end("ERROR");
               } else {
                   res.end("OK");
               }
        }
    );

    // requestSync(
    //     { url: endpoint, //URL to hit
    //       method: 'POST', //Specify the method
    //       headers: { //We can define headers too
    //          'Content-Type': 'text/xml',
    //       },
    //       body: refreshBody //Set the body as a string
    //    }
    //    , function(error, response_call, body) {
    //          var status = false;
    //          var code = 0;
    //          if (!error && response_call.statusCode == 200) {
    //               status = true;
    //               code = 200;
    //          } if (!error) {
    //               code = response_call.statusCode;
    //          } else {
    //               status = false;
    //          }
    //          console.log("URL " + endpoint + " is:" + status + " code: " + code + " \n Body:" + body)
    //   });


    //res.end("Refresh request has been sent to: " + endpoint);
    //res.send('');
}
