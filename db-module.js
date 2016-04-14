//var cron = require('./global');

//DB Management
exports.DBConnect = function() {
    // Type 1: In-memory only datastore (no need to load the database)
    var Datastore = require('nedb')
    db = new Datastore();
}

exports.insert = function(nameParam, ipParam, portParam, urlParam, isOKParam, typeParam, envParam) {
    var dataJSON = { name: nameParam, ip: ipParam, port:portParam, url: urlParam, type: typeParam, env: envParam, isOK: isOKParam, firstErrorDate: null, httpCode: 0, createdDate: new Date() };
    console.log("Inserting: " + JSON.stringify(dataJSON));

    db.insert(dataJSON, function (err, newDoc) {   // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
      console.log("Data inserted: " + JSON.stringify(newDoc));
    });
}

exports.update = function(urlParam, isOKParam, codeParam) {
    //db.update(JSON.parse('{  "url" : " ' + url + '"} '), JSON.parse('{ "$set": { "isOK": "'   + isOK + '" }}') , function (err, newDoc) {   // Callback is optional
    console.log("Updating: " + urlParam + ", " + isOKParam);

    var updateJson = {}

    if (!isOKParam) {
            var errorDate = new Date();
           
            db.find( { $and: [{url:urlParam}, {isOK:false}] }).exec(function (err, docs) {
              console.log("Consult lenght: " + docs.length)
              if (docs.length == 1) {
                updateJson = { $set: { isOK: false, httpCode: codeParam }}
              } else {
                updateJson = { $set: { isOK: false, firstErrorDate: errorDate.toJSON(), httpCode: codeParam }}
              }

              db.update({ url : urlParam }, updateJson, {} , function (err, newDoc) {   // Callback is optional
                    console.log("Error: " + err);
                    console.log("Updated rows: " + newDoc);
              });
            });

            //updateJson = { $set: { isOK: false, firstErrorDate: errorDate.toJSON(), httpCode: codeParam }}
    } else {
            updateJson = { $set: { isOK: true, httpCode: codeParam }}
            db.update({ url : urlParam }, updateJson, {} , function (err, newDoc) {   // Callback is optional
                console.log("Error: " + err);
                console.log("Updated rows: " + newDoc);
            });
    }
}

//Find rows that were OK in the calling
exports.find = function() {
    //db.find({ isOK: true }, function (err, docs) {
    db.find({}).sort( {env: 1}).exec(function (err, docs) {
      // If no document is found, docs is equal to []
      //console.log("Found doc: " + JSON.stringify(docs));

      // return docs;
      response = docs;
  });
}
