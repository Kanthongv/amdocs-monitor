var dateFormat = require('dateformat');

exports.buildHTML = function(jsonResponse) {
    var httpRes = '<br/><p>Last update on ' + dateFormat(new Date(), "dd/mm/yyyy h:MM:ss");  + ' </p>'
     httpRes = httpRes + '<br/><p>Refresh in seconds: ' + REFRESH_TIME + ' </p>'
     httpRes = httpRes + '<table border=0 width="100%" style="border: 2px solid green">' +
        '<tr align="left" style="font-size:25px"><th>Name</th><th>URL</th><th>Last Error</th><th>HTTP Code</th><th>Status</th></tr>';

    // jsonResponse.forEach(function(e) {
    //     Object.keys(e).forEach(function(key) {
    //
    //         if ((key = "isOK") && (key = "url") ) {
    //             var value = e[key]
    //             httpRes = httpRes + '<br>' + key + ': ' + value + '</br>'
    //
    //             console.log(value)
    //         }
    //     })
    //
    //
    // })

    if (jsonResponse == "") {
        return 'No defined values';
    } else {
        console.log("Parse: " + jsonResponse);
    }

    jsonResponse.forEach(function(value) {
        httpRes = httpRes + '<tr>'

        var lastErrorString = '';
        if (value.firstErrorDate != null) {
            try {
                lastErrorString = dateFormat(new Date(value.firstErrorDate), "dd/mm/yyyy h:MM:ss"); // (new Date(value.firstErrorDate)).format("%d-%m-%y %H:%M:%S");
            } catch(err) {
                console.log(err);
            }
        }

        statusStr = '<td><font style="color:red">ERROR</font></td>';
        if (value.isOK) {
            statusStr = '<td><font style="color:green">OK</font></td>'
        }
        var link = ''
        console.log("Value type: " + value.type);
        if (value.type == "none") {
            link = '<a href="' + value.url + '" target="_blank">' + value.url + '</a>';
        } else if (value.type == "ASM") {
            link = 'ASM';
        }  else {
            link = value.url;
        }

        httpRes = httpRes + '<td style="font-weight: bold;">' + value.name + '</td><td>' + link  + '</td><td>'
                          + lastErrorString + '</td><td>' + value.httpCode + '</td>' + statusStr

        httpRes = httpRes + '</tr>'
    })
    httpRes = httpRes + '</table>';
    return httpRes;
}
