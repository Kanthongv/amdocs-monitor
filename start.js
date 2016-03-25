/*
res
    http://www.cronmaker.com/
    https://github.com/ncb000gt/node-cron

*/
var request = require('request');
var express = require('express');
var fs = require("fs");

var dbMod = require('./db-module');
var front = require('./front-end');
var cron = require('./crontask');

//var cron = require('./global');

var app = express();

const SERVER_PORT = 9090;
const OK = 'OK';
const ERROR = 'ERROR';

REFRESH_TIME = 30;

response = '';

var urls = [ {name:'Internet', type: 'none', url:'http://www.google.com'} ,

             {name:'DESA', type: 'none', env:'DESA', url:'http://10.0.0.234:7100/sbconsole'},
             {name:'DESA - ASM', type: 'ASM', env:'DESA', url:'http://10.0.0.234:7101/ASM/proxy/asm_PX'},

             {name:'TEST', type: 'none', env:'TEST', url:'http://10.0.0.234:8100/sbconsole'},
             {name:'TEST - ASM', type: 'ASM', env:'TEST', url:'http://10.0.0.234:8101/ASM/proxy/asm_PX'},

             {name:'UAT_A', type: 'none', env:'UAT', url:'http://localhost:7011/sbconsole'},
             {name:'UAT_A - ASM', type: 'ASM', env:'UAT', url:'http://localhost:7012/ASM/proxy/asm_PX'},

             {name:'UAT_B', type: 'none', env:'UAT', url:'http://localhost:11079/sbconsole'},
             {name:'UAT_B - ASM', type: 'ASM', env:'UAT', url:'http://localhost:7010/ASM/proxy/asm_PX'},

             {name:'UAT_D', type: 'none', env:'UAT', url:'http://localhost:7041/sbconsole'},
             {name:'UAT_D - ASM', type: 'ASM', env:'UAT', url:'http://localhost:7042/ASM/proxy/asm_PX'},

             {name:'UAT_E', type: 'none', env:'UAT', url:'http://localhost:7030/sbconsole'},
             {name:'UAT_E - ASM', type: 'ASM', env:'UAT', url:'http://localhost:7031/ASM/proxy/asm_PX'},

             {name:'PET WLS OBC  - ADM', type: 'none', env:'PET', url:'http://localhost:3002/sbconsole'},
             {name:'PET WLS OBC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3003/ASM/proxy/asm_PX'},
             {name:'PET WLS ONC  - ADM', type: 'none', env:'PET', url:'http://localhost:3006/sbconsole'},
             {name:'PET WLS ONC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3007/ASM/proxy/asm_PX'},

             {name:'PET WLN ONC  - ADM', type: 'none', env:'PET', url:'http://localhost:3004/sbconsole'},
             {name:'PET WLN ONC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3005/ASM/proxy/asm_PX'},

             {name:'PET WLN OBC  - ADM', type: 'none', env:'PET', url:'http://localhost:3000/sbconsole'},
             {name:'PET WLN OBC  - ASM', type: 'ASM', env:'PET', url:'http://localhost:3001/ASM/proxy/asm_PX'},

             {name:'PET ASYNC - ADM', type: 'none', env:'PET', url:'http://localhost:3010/sbconsole'},
             {name:'PET ASYNC - ASM', type: 'ASM', env:'PET', url:'http://localhost:3011/ASM/proxy/asm_PX'},

             {name:'PET COLIVING - ADM', type: 'none', env:'PET', url:'http://localhost:3014/sbconsole'},
             {name:'PET COLIVING - ASM', type: 'ASM', env:'PET', url:'http://localhost:3015/ASM/proxy/asm_PX'},

             {name:'PET SYNC - SOA', type: 'none', env:'PET', url:'http://localhost:3020/console/login/LoginForm.jsp'},
             {name:'PET ASYNC - SOA', type: 'none', env:'PET', url:'http://localhost:3030/console/login/LoginForm.jsp'},

             {name:'UAT_A - SOA', type: 'none', env:'UAT', url:'http://localhost:7005/console/login/LoginForm.jsp'},
             {name:'UAT_B - SOA', type: 'none', env:'UAT', url:'http://localhost:11011/console/login/LoginForm.jsp'},
             {name:'UAT_D - SOA', type: 'none', env:'UAT', url:'http://localhost:7051/em'},
             {name:'UAT_E - SOA', type: 'none', env:'UAT', url:'http://localhost:7032/em'},
           ];

var urls2 = [ {name:'Internet', type: 'none', url:'http://www.google.com'} ,
              {name:'None', type: 'none', url:'http://www.google.commerce'} ,
              {name:'CUSTOM ERROR', type: 'none', url:'http://localhost:9090/'}
            ];

app.use(express.static(__dirname + '/public'));

var asmReq = '';
fs.readFile('asm/generarTicket.xml', function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log("Read ASM request: " + data.toString());
    asmReq = data.toString();
});

app.listen(SERVER_PORT, function() {
    console.log('Listening on port: ' + SERVER_PORT);

    //Connect to DB
    dbMod.DBConnect();
    console.log("DB Connected!");

    handleInserts();
});

app.get('/data', function(req, res) {
     res.writeHead(200, {'Content-Type': 'text/html', 'refresh': REFRESH_TIME});

     console.log("HTTP Get Called!");

     dbMod.find()

     res.end(front.buildHTML(response));
});

/*
    Server mservice
    Return a list of endpoints result
*/
app.get('/list', function(req, res) {
     res.writeHead(200, {'Content-Type': 'application/json'});

     console.log("/List: Server endpoint called");

     dbMod.find()

     if (response == '') {
         console.log(">> Response value no set yet");
     }
     res.end(JSON.stringify(response));
});

//Manual Refresh task
app.get('/refresh', function(req, res) {
     //res.writeHead(200, {'Content-Type': 'text/html'});
     console.log("Refresh Called!");

     handlerHttpRequestCron(req, res);

    // res.end("OK");
     res.redirect('/');
});


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
    request.post({url:urlParam, body: asmReq}, function (error, response_call, body) {
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
        dbMod.insert(urls[value].name, urls[value].url, false, urls[value].type, urls[value].env);
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
