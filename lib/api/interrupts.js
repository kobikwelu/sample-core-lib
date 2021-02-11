/**
 * Collection of API integrations within the framework
 * @module api
 * @main api
 */

/**
 * Interrupts micro service will let us manipulate the interupts on test data by making rest calls to the service created by our pqe services team. Official microservice doumentation is found [on confluence](https://confluence-fof.appl.kp.org/display/PQE/Signoninterrupt+-+Gateway+to+LDAP)
 * @module utils
 * @class interrupts
 * @submodule api
 */
'use strict';

var env = require('../env'),
  helper = require('../helper'),
  expect = require('chai').expect,
  assert = require('chai').assert,
  request = require('request');

// Create the micro service base URI string
const baseUri = 'http://172.30.48.228:8080';

// Create a map for services environment and the env seen from UI
var which = {
  "wppdev1": "Dev1",
  "wppdev3": "Dev3",
  "wppdev4": "Dev4",
  "dev10": "Dev10",
  "dev11": "Dev11",
  "dev11B": "Dev11b",
  "dev20": "Dev20",
  "dev30": "Dev30",
  "hint1": "Hint1",
  "hint2": "Hint2",
  "hint2": "Hint2",
  "hint3": "Hint3",
  "hint10": "Hint10",
  "hpp": "Hpp",
  "hppb": "Hppb",
  "hppidc": "Hppidc",
  "hppndc": "Hppndc",
  "hprev": "Hprev",
  "hqa": "Hqa",
  "hqab": "Hqab",
  "hqac": "Hqac",
  "hqa10": "Hqa10",
  "hreg1": "Hreg1",
  "hreg2": "Hreg2",
  "qa11": "Qa11",
  "qa11b": "Qa11B"
};
var where = which[env.where];

module.exports = {
  /**
   * Modify an attribute in LDAP
   * @method modifyLdapAttribute
   * @param guid - The guid of the member whose properties we want to change
   * @param operationType - The desired LDAP operation we want to perform
   * @param attributeName - The name of the attribute we want to configure
   * @param attributeValue - The new value we want to have set. <b>NOTE:</b> for delete the value must be the <em>current</em> value. See test/sample/interruptsApi_spec.js for details
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  modifyLdapAttribute: (guid, operationType, attributeName, attributeValue, callback) => {
    const options = {
      method: 'POST',
      url: `${baseUri}/signoninterrupt/attribute/${operationType}/${guid}/${attributeName}/${attributeValue}/${where}`,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(`${err}\n${res}`);
        callback(res, JSON.parse(err));

      }
    });
  },
  /**
   * Clears all interrupts for a specific test data on the current env (as read from `go`/`grunt`).
   * @method clearAllInterrupts
   * @param guid - The guid of the member we want to clear
   * @param email - Email that is tied to that users account
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  clearAllInterrupts: function (guid, email, callback) {
    var options = {
      method: "PUT",
      url: baseUri + "/signoninterrupt/clearinterrupt/all/" + guid + "/" + email + "/" + where,
      qs: {
        "guid": guid,
        "email-id": email,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Gets all information for a specific test data on the current env (as read from `go`/`grunt`).
   * @method getAllUserProperties
   * @param guid - The guid of the member we want to get all properties for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  getAllUserProperties: function (guid, callback) {
    var options = {
      method: "GET",
      url: baseUri + "/signoninterrupt/getinterrupt/all/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };

    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Create terms and conditions for a specific test data on the current env (as read from `go`/`grunt`).
   * @method createTermsAndConditions
   * @param guid - The guid of the member we want to create T&C for
   * @param type - Type of T&C interrupt, can be not accepted, new version, or 1 year expiration; i.e. `tcnotaccepted`, `tcnewversion`, `tc365`
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  createTermsAndConditions: function (guid, type, callback) {
    var options = {
      method: "POST",
      url: baseUri + "/signoninterrupt/createinterrupt/" + type + "/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Clear the terms and condition status for the current guid-env combo
   * @method clearTermsAndConditions
   * @param guid - The guid of the member we want to clear T&C for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  clearTermsAndConditions: function (guid, callback) {
    var options = {
      method: "PUT",
      url: baseUri + "/signoninterrupt/clearinterrupt/termsandconditions/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Get the terms and condition status for the current guid-env combo
   * @method getTermsAndConditions
   * @param guid - The guid of the member we want to get T&C status for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  getTermsAndConditions: function (guid, callback) {
    var options = {
      method: "GET",
      url: baseUri + "/signoninterrupt/getinterrupt/kpTermsandCondAccepted/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Create temporary password interrupt for a specific test data on the current env (as read from `go`/`grunt`).
   * @method createTemporaryPassword
   * @param guid - The guid of the member we want to create temp passwd for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  createTemporaryPassword: function (guid, callback) {
    var options = {
      method: "POST",
      url: baseUri + "/signoninterrupt/createinterrupt/temporarypassword/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Clear the temporary password status for the current guid-env combo
   * @method clearTemporaryPassword
   * @param guid - The guid of the member we want to clear temp passwd for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  clearTemporaryPassword: function (guid, callback) {
    var options = {
      method: "PUT",
      url: baseUri + "/signoninterrupt/clearinterrupt/temporarypassword/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Get the activation status code for the current guid-env combo
   * @method getActivationStatusCode
   * @param guid - The guid of the member we want to get activation status code for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back. Response body will contain <code>"user": {"kpActivationStatusCode": "ACTIVE" }</code> if present, and will return <code>"kpActivationStatusCode": "value not present for this user"</code> if not found
   */
  getActivationStatusCode: function (guid, callback) {
    var options = {
      method: "GET",
      url: baseUri + "/signoninterrupt/getinterrupt/kpActivationStatusCode/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Create secret questions interrupt for the current guid-env combo
   * @method createSecretQuestions
   * @param guid - The guid of the member we want to create secret questions interrupt for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  createSecretQuestions: function (guid, callback) {
    var options = {
      method: "POST",
      url: baseUri + "/signoninterrupt/createinterrupt/secretquestions/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(err, res);
      }
    });
  },

  /**
   * Clear secret questions interrupt for the current guid-env combo
   * @method clearSecretQuestions
   * @param guid - The guid of the member we want to clear secret questions interrupt for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  clearSecretQuestions: function (guid, callback) {
    var options = {
      method: "PUT",
      url: baseUri + "/signoninterrupt/clearinterrupt/secretquestions/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Get the secret questions for the current guid-env combo
   * @method getSecretQuestions
   * @param guid - The guid of the member we want to get secret questions for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back. If secret questions are present we will display the questions in the body, else we will return an empty array, i.e. <code>"user": {"secret questions": [] }</code>
   */
  getSecretQuestions: function (guid, callback) {
    var options = {
      method: "GET",
      url: baseUri + "/signoninterrupt/getinterrupt/secretquestions/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Create email mismatch for the current guid-env combo
   * @method createEmailMismatch
   * @param guid - The guid of the member we want to create email mismatch for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  createEmailMismatch: function (guid, email, callback) {
    var options = {
      method: "POST",
      url: baseUri + "/signoninterrupt/createinterrupt/updateemail/" + guid + "/" + email + "/" + where,
      qs: {
        "guid": guid,
        "email-id": email,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Clear email mismatch for the current guid-env combo
   * @method clearEmailMismatch
   * @param guid - The guid of the member we want to clear email mismatch for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  clearEmailMismatch: function (guid, email, callback) {
    var options = {
      method: "PUT",
      url: baseUri + "/signoninterrupt/clearinterrupt/updateemail/" + guid + "/" + email + "/" + where,
      qs: {
        "guid": guid,
        "email-id": email,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Get email for the current guid-env combo
   * @method getUserEmail
   * @param guid - The guid of the member we want to get email for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back, e.g. <code>"user": {"mail": "arnab567@gmail.com" }</code> or if not found: <code>"user": {"mail": "value not present for this user" }</code>
   */
  getUserEmail: function (guid, callback) {
    var options = {
      method: "GET",
      url: baseUri + "/signoninterrupt/getinterrupt/mail/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Create stay in touch for the current guid-env combo
   * @method createStayInTouch
   * @param guid - The guid of the member we want to create stay in touch for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  createStayInTouch: function (guid, callback) {
    var options = {
      method: "POST",
      url: baseUri + "/signoninterrupt/createinterrupt/stayintouch/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Clear stay in touch for the current guid-env combo
   * @method clearStayInTouch
   * @param guid - The guid of the member we want to clear stay in touch for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  clearStayInTouch: function (guid, callback) {
    var options = {
      method: "PUT",
      url: baseUri + "/signoninterrupt/clearinterrupt/stayintouch/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Get email update time for the current guid-env combo
   * @method getEmailUpdateTime
   * @param guid - The guid of the member we want to get email update time for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back, e.g. <code>"user":{"kpemailupdatedatetime": "1487193331340" }</code> or if not found: <code>"user":{"kpemailupdatedatetime": "value not present for this user" }</code>
   *
   */
  getEmailUpdateTime: function (guid, callback) {
    var options = {
      method: "GET",
      url: baseUri + "/signoninterrupt/getinterrupt/kpemailupdatedatetime/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Create first time sign on for the current guid-env combo
   * @method createFirstTimeSignon
   * @param guid - The guid of the member we want to create first time sign on for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  createFirstTimeSignon: function (guid, callback) {
    var options = {
      method: "POST",
      url: baseUri + "/signoninterrupt/createinterrupt/firsttimesignon/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Clear first time sign on for the current guid-env combo
   * @method clearFirstTimeSignon
   * @param guid - The guid of the member we want to clear first time sign on for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back
   */
  clearFirstTimeSignon: function (guid, callback) {
    var options = {
      method: "PUT",
      url: baseUri + "/signoninterrupt/clearinterrupt/firsttimesignon/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });
  },

  /**
   * Get first time sign on status for the current guid-env combo
   * @method getFirstTimeSignon
   * @param guid - The guid of the member we want to get first time sign on status for
   * @param callback - <i>optional</i> Callback function that can be invoked
   * @return - Returns raw-response and json-body of the request as a call back.
   * <br>If found, <code>"user": {"kpfirsttimesignondatetime": "1486686772395" }</code>
   * <br>else, <code>"user": {"kpfirsttimesignondatetime": "value not present for this user" }</code>
   */
  getFirstTimeSignon: function (guid, callback) {
    var options = {
      method: "GET",
      url: baseUri + "/signoninterrupt/getinterrupt/kpfirsttimesignondatetime/" + guid + "/" + where,
      qs: {
        "guid": guid,
        "environment": where
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        callback(res, JSON.parse(body));
      } else {
        console.log(err + "\n" + res);
        callback(res, JSON.parse(err));

      }
    });

  }

}
