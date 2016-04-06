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

app = express();

const SERVER_PORT = 9090;
const OK = 'OK';
const ERROR = 'ERROR';

//const REFRESH_TIME = 30;

response = '';

var urls = [ {name:'Internet', type: 'none', env:'NA', url:'http://www.google.com'} ,

             {name:'DESA', type: 'none', env:'DESA', url:'http://10.0.0.234:7100/sbconsole'},
             {name:'DESA - ASM', type: 'ASM', env:'DESA', url:'http://10.0.0.234:7101/ASM/proxy/asm_PX', ip:'10.0.0.234', port:'7101'},

             {name:'TEST', type: 'none', env:'TEST', url:'http://10.0.0.234:8100/sbconsole'},
             {name:'TEST - ASM', type: 'ASM', env:'TEST', url:'http://10.0.0.234:8101/ASM/proxy/asm_PX', ip:'10.0.0.234', port:'8101'},

             {name:'UAT_A', type: 'none', env:'UAT', url:'http://localhost:7011/sbconsole'},
             {name:'UAT_A - ASM', type: 'ASM', env:'UAT', url:'http://localhost:7012/ASM/proxy/asm_PX', ip:'localhost', port:'7012'},

             {name:'UAT_B', type: 'none', env:'UAT', url:'http://localhost:11079/sbconsole'},
             {name:'UAT_B - ASM', type: 'ASM', env:'UAT', url:'http://localhost:11080/ASM/proxy/asm_PX', ip:'localhost', port:'11080'},

             {name:'UAT_D', type: 'none', env:'UAT', url:'http://localhost:7041/sbconsole'},
             {name:'UAT_D - ASM', type: 'ASM', env:'UAT', url:'http://localhost:7042/ASM/proxy/asm_PX', ip:'localhost', port:'7042'},

             {name:'UAT_E', type: 'none', env:'UAT', url:'http://localhost:7030/sbconsole'},
             {name:'UAT_E - ASM', type: 'ASM', env:'UAT', url:'http://localhost:7031/ASM/proxy/asm_PX', ip:'localhost', port:'7031'},

             {name:'PET WLS OBC  - ADM', type: 'none', env:'PET', url:'http://localhost:3002/sbconsole'},
             {name:'PET WLS OBC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3003/ASM/proxy/asm_PX', ip:'localhost', port:'3003'},

             {name:'PET WLS ONC  - ADM', type: 'none', env:'PET', url:'http://localhost:3006/sbconsole'},
             {name:'PET WLS ONC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3007/ASM/proxy/asm_PX', ip:'localhost', port:'3007'},

             {name:'PET WLN ONC  - ADM', type: 'none', env:'PET', url:'http://localhost:3004/sbconsole'},
             {name:'PET WLN ONC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3005/ASM/proxy/asm_PX', ip:'localhost', port:'3005'},

             {name:'PET WLN OBC  - ADM', type: 'none', env:'PET', url:'http://localhost:3000/sbconsole'},
             {name:'PET WLN OBC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3001/ASM/proxy/asm_PX', ip:'localhost', port:'3001'},

             {name:'PET ASYNC - ADM', type: 'none', env:'PET', url:'http://localhost:3010/sbconsole'},
             {name:'PET ASYNC - ASM', type: 'ASM', env:'PET', url:'http://localhost:3011/ASM/proxy/asm_PX', ip:'localhost', port:'3011'},

             {name:'PET COLIVING - ADM', type: 'none', env:'PET', url:'http://localhost:3014/sbconsole'},
             {name:'PET COLIVING - ASM', type: 'ASM', env:'PET', url:'http://localhost:3015/ASM/proxy/asm_PX', ip:'localhost', port:'3015'},

             {name:'PET SYNC - SOA', type: 'none', env:'PET', url:'http://localhost:3020/em'},
             {name:'PET ASYNC - SOA', type: 'none', env:'PET', url:'http://localhost:3030/em'},

             {name:'DESA - SOA', type: 'none', env:'DESA', url:'http://10.0.0.234:7000/em'},
             {name:'TEST - SOA', type: 'none', env:'TEST', url:'http://10.0.0.234:8000/em'},

             {name:'UAT_A - SOA', type: 'none', env:'UAT', url:'http://localhost:7015/em'},
             {name:'UAT_B - SOA', type: 'none', env:'UAT', url:'http://localhost:11011/em'},
             {name:'UAT_D - SOA', type: 'none', env:'UAT', url:'http://localhost:7051/em'},
             {name:'UAT_E - SOA', type: 'none', env:'UAT', url:'http://localhost:7032/em'},
           ];

var urls2 = [ {name:'Internet', type: 'none', url:'http://www.google.com'} ,
              {name:'None', type: 'none', url:'http://www.google.commerce'} ,
              {name:'CUSTOM ERROR', type: 'none', url:'http://localhost:9090/'}
            ];

app.use(express.static(__dirname + '/public'));

app.listen(SERVER_PORT, function() {
    console.log('Listening on port: ' + SERVER_PORT);

    //Connect to DB
    dbMod.DBConnect();
    console.log("DB Connected!");

    asmReq = fs.getASMRequest();
    refreshBPTReq = fs.getRefreshBPTRequest();

    handleInserts();
});


// app.get('/#', function(req, res) {
//     res.redirect('public/index.html');

// });

// app.get('#', function(req, res) {
//     res.redirect('public/index.html/#');

// });




//Send request to url
//Update the status in the memory db
function send_request(url, typeParam) {
    //Check ASM type
    if (typeParam == 'ASM') {
        send_ASM_request(url, typeParam)
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
      //console.log("URL is " + status)
      dbMod.update(url, status, code);
    })
}

function send_ASM_request(urlParam, typeParam) {
    //Fill body
    request.post({ url:urlParam, body: asmReq}, function (error, response_call, body) {
      var status = false;
      var code = 0;
      //console.log("Response: " + body.toString());
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
       }

      //console.log("URL is " + status)
      dbMod.update(urlParam, status, code);
    })
}

//Insert first rows at init
function handleInserts() {
    //Loop
    for (var value in urls) {
        dbMod.insert(urls[value].name,  urls[value].ip,  urls[value].port,  urls[value].url, false, 
        urls[value].type, urls[value].env);
    }
};

//Called by cron task
exports.handlerHttpRequestCron = function () {
    //Loop
    for (var value in urls) {
        //send_request(urls[value],  req, res);
        send_request(urls[value].url,  urls[value].type);
    }
};

// API CALL
// ===========================================
app.get('/list', api.list)

var bodyParser = require('body-parser')

//var multer = require('multer'); // v1.0.5
//var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/refreshBPT', api.refreshBPT)


//Manual Refresh task
app.get('/refresh', function(req, res) {
     console.log("Refresh Called!");

     handlerHttpRequestCron(req, res);
     res.redirect('/');
});
