module.exports = function () {
  return {
    matchData: function (allure_qcid, allure_status, qc_qcid, qc_uniqueid, matched_status, qcid_update, uniqueid_update, allure_stacktrace, matched_stacktrace, callback) {
      var allure_qcid_length = allure_qcid.length;
      var counterA = 0;
      console.log('initial:','allure_qcid lenght',allure_qcid.length,'qc_qcid length',qc_qcid.length)
      // Loop for each allure_qcid
      allure_qcid.forEach((value, index) => {

        var qcIndex = qc_qcid.indexOf(value);
        // If allure_qcid exits in qc_qcid then push the info to final table.
        if (qcIndex !== -1) {
          matched_status.push(allure_status[index]);
          qcid_update.push(qc_qcid[qcIndex]);
          uniqueid_update.push(qc_uniqueid[qcIndex]);
          matched_stacktrace.push(allure_stacktrace[index]);
          // Below console logs will help with debug
          // console.log('--------------------------------')
          // console.log('qcid found:'+qc_qcid[qcIndex])
          // console.log('status found:'+allure_status[index])
          // console.log('found allure-qcid in qc_qcid count:'+qcid_update.length)
          // console.log('left over allure-qcid to find:'+(allure_qcid.length-qcid_update.length))
          // console.log('--------------------------------')
        }
        counterA++;
        // After you loop through the 100 values in qc_qcid get out and just return the match/final results
        if (counterA === allure_qcid_length) {
           console.log('End MATCHING:','Matched array qcid_update lenght',qcid_update.length)
          callback(matched_status, qcid_update, uniqueid_update, matched_stacktrace);
        }
      });
    }
  };
};