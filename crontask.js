var CronJob = require('cron').CronJob;
var st = require('./start');

var job = new CronJob("* * * * *", function() {
    /*
    * Runs every minute
    */
    console.log(">>>>> Executing cron at: " + new Date());
    st.handlerHttpRequestCron();
  }, function () {
    /* This function is executed when the job stops */
    console.log("CronJob stoped!");
  },
  false,
  'America/Los_Angeles'
);
job.start();
