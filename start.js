'use strict'

/*
resources
    http://www.cronmaker.com/
    https://github.com/ncb000gt/node-cron

*/
var request = require('request');
var express = require('express');

var dbMod = require('./db-module');
var front = require('./front-end');
var cron = require('./crontask');

var api = require('./api');
var fs = require('./file');

var gl = require('./global');

var logger = require('./logger');

var config = require('./config/config.dev.json');

//var escape = require('escape-html');


var app = express();
var bodyParser = require('body-parser')

//var multer = require('multer'); // v1.0.5
//var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const SERVER_PORT = 9090;
const OK = 'OK';
const ERROR = 'ERROR';


var urls = [ {name:'Internet', type: 'none', env:'NA', url:'http://www.google.com', ip:'10.0.0.234', port:'7100'} ,
             {name:'Custom error test', type: 'none', env:'NA', url:'http://localhost:9090/custerror', ip:'10.0.0.234', port:'7100'},

             {name:'DESA', type: 'OSB', env:'DESA', url:'http://10.0.0.234:7100/sbconsole', ip:'10.0.0.234', port:'7100'},

             {name:'TEST', type: 'OSB', env:'TEST', url:'http://10.0.0.234:8100/sbconsole', ip:'10.0.0.234', port:'8100'},

             {name:'UAT_A - 3', type: 'OSB', env:'UAT', url:'http://10.136.52.136:7001/sbconsole', ip:'localhost', port:'7011'},
             {name:'UAT_A - 3 - ASM', type: 'ASM', env:'UAT', url:'http://10.136.52.136:7002/ASM/proxy/asm_PX', ip:'localhost', port:'7012'},

             {name:'UAT_B - 8', type: 'OSB', env:'UAT', url:'http://10.136.52.136:7009/sbconsole', ip:'localhost', port:'11079'},
             {name:'UAT_B - 8 - ASM', type: 'ASM', env:'UAT', url:'http://10.136.52.136:7010/ASM/proxy/asm_PX', ip:'localhost', port:'11080'},

             {name:'UAT_D - 6', type: 'OSB', env:'UAT', url:'http://10.136.52.136:7041/sbconsole', ip:'localhost', port:'7041'},
             {name:'UAT_D - 6 - ASM', type: 'ASM', env:'UAT', url:'http://10.136.52.136:7042/ASM/proxy/asm_PX', ip:'localhost', port:'7042'},

             {name:'UAT_E - 4', type: 'OSB', env:'UAT', url:'http://10.136.52.174:7030/sbconsole', ip:'localhost', port:'7030'},
             {name:'UAT_E - 4 - ASM', type: 'ASM', env:'UAT', url:'http://10.136.52.174:7031/ASM/proxy/asm_PX', ip:'localhost', port:'7031'},

             {name:'PET WLS OBC  - ADM', type: 'OSB', env:'PET', url:'http://10.136.52.126:3002/sbconsole', ip:'localhost', port:'3002'},
             {name:'PET WLS OBC  - ASM', type: 'ASM', env:'PET', url:'http://10.136.52.126:3003/ASM/proxy/asm_PX', ip:'localhost', port:'3003'},

             {name:'PET WLS ONC  - ADM', type: 'OSB', env:'PET', url:'http://10.136.52.126:3006/sbconsole', ip:'localhost', port:'3006'},
             {name:'PET WLS ONC  - ASM', type: 'ASM', env:'PET', url:'http://10.136.52.126:3007/ASM/proxy/asm_PX', ip:'localhost', port:'3007'},

             {name:'PET WLN ONC  - ADM', type: 'OSB', env:'PET', url:'http://10.136.52.126:3004/sbconsole', ip:'localhost', port:'3004'},
             {name:'PET WLN ONC  - ASM', type: 'ASM', env:'PET', url:'http://10.136.52.126:3005/ASM/proxy/asm_PX', ip:'localhost', port:'3005'},

             {name:'PET WLN OBC  - ADM', type: 'OSB', env:'PET', url:'http://10.136.52.126:3000/sbconsole', ip:'localhost', port:'3000'},
             {name:'PET WLN OBC  - ASM', type: 'ASM', env:'PET', url:'http://10.136.52.126:3001/ASM/proxy/asm_PX', ip:'localhost', port:'3001'},

             {name:'PET ASYNC - ADM', type: 'OSB', env:'PET', url:'http://10.136.52.126:3010/sbconsole', ip:'localhost', port:'3010'},
             {name:'PET ASYNC - ASM', type: 'ASM', env:'PET', url:'http://10.136.52.126:3011/ASM/proxy/asm_PX', ip:'localhost', port:'3011'},

             {name:'PET COLIVING - ADM', type: 'OSB', env:'PET', url:'http://10.136.52.126:3014/sbconsole', ip:'localhost', port:'3014'},
             {name:'PET COLIVING - ASM', type: 'ASM', env:'PET', url:'http://10.136.52.126:3015/ASM/proxy/asm_PX', ip:'localhost', port:'3015'},

             {name:'PET ASYNC - SOA', type: 'SOA', env:'PET', url:'http://10.136.52.126:3020/em', ip:'localhost', port:'3020'},
             {name:'PET SYNC - SOA', type: 'SOA', env:'PET', url:'http://10.136.52.126:3030/em', ip:'localhost', port:'3030'},

             {name:'DESA - SOA', type: 'SOA', env:'DESA', url:'http://10.0.0.234:7000/em', ip:'localhost', port:'7000'},
             {name:'TEST - SOA', type: 'SOA', env:'TEST', url:'http://10.0.0.234:8000/em', ip:'localhost', port:'8000'},

             {name:'UAT_A - 3 - SOA', type: 'SOA', env:'UAT', url:'http://10.136.52.136:7005/em', ip:'localhost', port:'7015'},
             {name:'UAT_B - 8 - SOA', type: 'SOA', env:'UAT', url:'http://10.136.52.136:7012/em', ip:'localhost', port:'11011'},
             {name:'UAT_D - 6 - SOA', type: 'SOA', env:'UAT', url:'http://10.136.52.136:7052/em', ip:'localhost', port:'7051'},
             {name:'UAT_E - 4 - SOA', type: 'SOA', env:'UAT', url:'http://10.136.52.174:7033/em', ip:'localhost', port:'7032'},
           ];

var urls2 = [ {name:'Internet', type: 'none', url:'http://www.google.com'} ,
              {name:'None', type: 'none', url:'http://www.google.commerce'} ,
              {name:'CUSTOM ERROR', type: 'none', url:'http://localhost:9090/'}
            ];

app.use(express.static(__dirname + '/public'));

//Start server
app.listen(config.port, function() {
    logger.log.info('App Version: ' + config.app_version);
    logger.log.info('Listening on port: ' + config.port);

    //Connect to DB
    dbMod.DBConnect();
    logger.log.info("DB Connected!");

    fs.getASMRequest();
    fs.getRefreshBPTRequest();

    handleInserts();
});


//Send request to url
//Update the status in the memory db
function sendRequest(url, typeParam) {
    //Check ASM type
    if (typeParam == 'ASM') {
        sendASMRequest(url, typeParam)
        //Scrap for response text
        return;
    }

    request(url, function (error, response_call, body) {
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

      logger.log.debug("URL is " + status)
      dbMod.update(url, status, code, buildErrorText(error, response_call, body));
    })
}

function sendASMRequest(urlParam, typeParam) {
    //Fill body
    request.post({ url:urlParam, body: fs.getASMRequest()}, function (error, response_call, body) {
      var status = false;
      var code = 0;
 
      if (!error && response_call.statusCode == 200) {
            //Scrap for response text
            if (body.indexOf('m:Token') > -1) {
                status = true;
            } else {
                status = false;
            }
            code = 200;
       } if (!error) {
            code = response_call.statusCode;
       } else {
            status = false;
            logger.log.error("Response sendASMRequest: " + (body)?body:'');
       }

      //logger.log.info("URL is " + status)
      dbMod.update(urlParam, status, code, buildErrorText(error, response_call, body));
    })
}

function buildErrorText(error, response_call, body) {
    var returnText = ''

    logger.log.debug('Error: ' + JSON.stringify(error));
    //logger.log.debug('response_call: ' + response_call);
    //logger.log.debug('body: ' + body);

    if (error) {
      returnText = "Codigo: " + error.code + " numero: " + error.errno + " systema: " + error.syscall;
    }

    // if (body) {
    //   returnText = returnText + 'Response: ' + body // + escape(refreshBPTReq)
    // }

    //returnText = body //(error !== null && error !== undefined)? JSON.stringify(error.)):'' + ' - ' 

     // returnText = '' + (response_call !== null && (typeof response_call !== "undefined"))?response_call:'' + ' - ' + 
     //             (body !== null && (typeof body !== "undefined"))?body:''

    logger.log.debug('Return text: ' + returnText);

    //returnText = "{'ljf' } ldjl dlj dslfjsd lfj lajldf jlasdjf lsasdjf lkjl jsdlf jaslsdjf lsaj flsdjkfl sdjal fsdl fjlsdlsd fldsjdlj ljdslfjsd ljsdldslsld jldsj lj l "

                              //(error === undefined)?'':error + (response_call === undefined)?'':response_call + (body === undefined)?'':body
    return returnText;
}

//Insert first rows at init
function handleInserts() {
    //Loop
    for (var value in urls) {
        dbMod.insert(urls[value].name,  urls[value].ip,  urls[value].port,  urls[value].url, true, 
        urls[value].type, urls[value].env,
        //Empty String
        "NA"
        );
    }
};

//Called by cron task
exports.handlerHttpRequestCron = function () {
    //Loop
    for (var value in urls) {
        //sendRequest(urls[value],  req, res);
        sendRequest(buildURL(urls[value].url, urls[value].ip, urls[value].port, urls[value].type),  urls[value].type);
    }
};

/* 
    Build an URL with provided parameters
*/
function buildURL(url, ip, port, type) {
    var returnURL = 'http://'
    if (type == 'OSB') {
        returnURL = returnURL + ip + ':' + port + '/console'
    } else if (type == 'ASM') {
        returnURL = returnURL + ip + ':' + port + '/ASM/proxy/asm_PX'
    } else if (type == 'SOA') {
        returnURL = returnURL + ip + ':' + port + '/em'
    } else if (type == 'none') {
        returnURL = url
    }
    logger.log.debug('func buildURL: ' + returnURL)
    return returnURL
}

// ===========================================
// API CALL
// ===========================================
app.get('/list', api.list)
app.post('/refreshBPT', api.refreshBPT)

//Manual Refresh task
app.get('/refresh', function(req, res) {
     logger.log.info("Refresh Called!");

     handlerHttpRequestCron(req, res);
     res.redirect('/');
});

app.get('/custerror', function(req, res) {
     logger.log.info("Error Called!");

     res.status(500).send('Something has been broken!');
});

app.get('/healthCheck', function(req, res) {
     logger.log.info("healthCheck called.");
     res.status(200).send('OK');
});