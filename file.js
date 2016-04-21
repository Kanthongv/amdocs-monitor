'use strict'

var fs = require("fs");
var logger = require('./logger');

var asmReq = ''
var refreshBPTReq = ''

exports.getASMRequest = function () {
    if (asmReq == '') {
        logger.log.debug("Loading ASM Request file");
        fs.readFile('./asm/generarTicket.xml', function (err, data) {
            if (err) {
                logger.log.debug(err)
                return '';
            }
            logger.log.debug("Read ASM request: " + data.toString());

            asmReq = data.toString();
        });
    } else {
        logger.log.debug("Found already loaded asmReq!");
    }

    return asmReq;
}

exports.getRefreshBPTRequest = function () {
    if (refreshBPTReq == '') {
        logger.log.debug("Loading refreshBPT file");
        fs.readFile('./asm/refreshBPT.xml', function (err, data) {
            if (err) {
                logger.log.debug(err)
                return '';
            }
            logger.log.debug("Read refreshBPT request: " + data.toString());
            refreshBPTReq = data.toString();
        });
    }
    //console.log("Read ASM request: " + asmReq);
    return refreshBPTReq;
}

// exports.asmReq = asmReq;
// exports.refreshBPTReq = refreshBPTReq;