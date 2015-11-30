var unirest = require('unirest');
var hookUrl = "https://joncombe-mailtest-v1.p.mashape.com/v1/";

module.exports = function(apikey) {
  if (!isValidAPIKey(apikey)) {
    throw new Error("No valid API Key!");
  }
  return function(email, cb){
    var regex = /^\S+@(\S+\.\S+)$/g;
    var proof = {
      valid: regex.test(email),
      domain: email.replace(/.*@/, "")
    };
    if (proof.valid){
      var url = hookUrl + proof.domain;
      unirest.get(url)
      .header("X-Mashape-Key", apikey)
      .header("Accept", "application/json")
      .end(function (response) {
        if (response.status == 200){
          cb(response.body);
        } else {
          cb(false);
        }
      });
    } else {
      cb(false);
    }
  }
}

function isValidAPIKey(apikey) {
  var regex = /^[a-zA-Z0-9]{50}$/g;
  return regex.test(apikey);
}
