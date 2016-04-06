var fs = require("fs");

asmReq = ''
refreshBPTReq = ''

exports.getASMRequest = function () {
    if (asmReq == '') {
        fs.readFile('asm/generarTicket.xml', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Read ASM request: " + data.toString());
            asmReq = data.toString();
        });
    }
    //console.log("Read ASM request: " + asmReq);
    return asmReq;
}

exports.getRefreshBPTRequest = function () {
    if (refreshBPTReq == '') {
        fs.readFile('asm/refreshBPT.xml', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Read refreshBPT request: " + data.toString());
            refreshBPTReq = data.toString();
        });
    }
    //console.log("Read ASM request: " + asmReq);
    return refreshBPTReq;
}
