'use strict'

var gl = require('./global');
var logger = require('./logger');
var db;

//DB Management
exports.DBConnect = function() {
    // Type 1: In-memory only datastore (no need to load the database)
    var Datastore = require('nedb')
    db = new Datastore()
}

//exports.db = db;

/*
 * Insert url row into DB 
 */
exports.insert = function(nameParam, ipParam, portParam, urlParam, isOKParam, typeParam, envParam, lastErrorParam) {
    var dataJSON = { name: nameParam, ip: ipParam, port:portParam, url: urlParam, type: typeParam, 
        env: envParam, isOK: isOKParam, firstErrorDate: null, httpCode: 0, createdDate: new Date(),
        lastError: lastErrorParam };
    
    logger.log.debug("Inserting: " + JSON.stringify(dataJSON));

    db.insert(dataJSON, function (err, newDoc) {
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
      logger.log.debug("Data inserted: " + JSON.stringify(newDoc));
    })
}

/*
  Update url check status on DB
*/
exports.update = function(urlParam, isOKParam, codeParam, lastErrorParam) {
    logger.log.debug("Updating: " + urlParam + ", " + isOKParam);

    var updateJson = {}

    if (!isOKParam) {
            var errorDate = new Date();
           
            db.find( { $and: [{url:urlParam}, {isOK:false}] }).exec(function (err, docs) { //Search row
              logger.log.debug("Consult lenght: " + docs.length)
              if (docs.length == 1) {
                //Error already existed before
                updateJson = { $set: { isOK: false, httpCode: codeParam }}
              } else {
                updateJson = { $set: { isOK: false, firstErrorDate: errorDate.toJSON(), httpCode: codeParam, lastError: lastErrorParam }}
              }

              db.update({ url : urlParam }, updateJson, {} , function (err, newDoc) {
                  if (err) {
                    logger.log.error("Error: " + err);
                  }

                  logger.log.debug("Updated rows: " + newDoc);
              });
            });
    } else {
            updateJson = { $set: { isOK: true, httpCode: codeParam }}

            db.update({ url : urlParam }, updateJson, {} , function (err, newDoc) {
                  if (err) {
                    logger.log.error("Error: " + err);
                  }

                  logger.log.debug("Updated rows: " + newDoc);
            });
    }
}

//Find rows that were OK in the calling
exports.find = function() {
    db.find({}).sort( {env: 1}).exec(function (err, docs) {
      // If no document is found, docs is equal to []
      gl.response = docs;
  });
}