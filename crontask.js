'use strict'

var CronJob = require('cron').CronJob;
var st = require('./start');

var logger = require('./logger');

var job = new CronJob("* * * * *", function() {
    /*
    * Runs every minute
    */
    logger.log.info("Executing CRONTASK at: " + new Date());

    st.handlerHttpRequestCron();
  }, function () {
    /* This function is executed when the job stops */
    logger.log.info("CronJob stoped!");
  },
  false,
  'America/Los_Angeles'
);
job.start();
