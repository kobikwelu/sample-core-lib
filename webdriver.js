module.exports = function webdriverTestSuite(name, grunt, directories) {
    'use-strict';
    var report = require('./reporter.js')();
    var qcUpdates = require('./lib/api/alm/qcCall.js');
    require('grunt-mocha-test/tasks/mocha-test')(grunt);

    process.env.BROWSER = grunt.option("browser") || grunt.option("br") || "phantomjs";
    process.env.ENVIRONMENT = grunt.option("environment") || "dev1";
    process.env.PLATFORM = grunt.option("platform") || "desktop";
    process.env.BROWSER_WIDTH = grunt.option("browserwidth");
    process.env.BROWSER_HEIGHT = grunt.option("browserheight");
    process.env.SELENIUMTIMEOUT = grunt.option("seleniumtimeout");
    process.env.REGIONS = grunt.option("regions");
    process.env.DEVICE_ID = grunt.option("deviceid");
    process.env.MOBILE_OS = grunt.option("mobileos");
    process.env.QC_TEST_SET_ID = grunt.option("testsetid");
    process.env.PERFECTO_USERNAME = grunt.option("perfectousername");
    process.env.PERFECTO_PASSWORD = grunt.option("perfectopassword");
    process.env.RESULTSDIRSUFFIX = grunt.option("resultsdirsuffix") || "grid";
    process.env.LOCATION = grunt.option("location") || "remote";

    var tasks = ["force:on", "mochaTest:" + name, "redoReport"];
    var allureReportFolderName = 'allure-results' + process.env.RESULTSDIRSUFFIX;
    var config = {
        mochaTest: {}
    };

    config.mochaTest['endtoend'] = {
        options: {
            reporter: 'mocha-multi',
            reporterOptions: {
                "mocha-allure-reporter": {
                    stdout: "-"
                },
                "tap": {
                    stdout: "-"
                },
                "mocha-junit-reporter": {
                    stdout: "-"
                }
            },

            timeout: 1000000,
            logErrors: true,
            targetDir: allureReportFolderName,
            captureFile: directories.target + '/' + name + '/test-results.txt'
        },
        src: grunt.option("mochatestspecs").split(",")

    };

    config.mochaTest['debug'] = {
        options: {
            reporter: 'tap',
            reporterOptions: {
                //  "stdout":directories.target + '/debug/test-results-tap.tap'
            },
            captureFile: directories.target + '/debug/test-results.tap',
            timeout: 60000,
            logErrors: true
        },
        src: grunt.option("mochatestspecs").split(",")
    };


    config.mochaTest['jenkins'] = {
        options: {
            reporter: 'mocha-junit-reporter',
            reporterOptions: {
                "mochaFile": "target/jenkins/report.xml",
                "suiteTitleSeparedBy": '.',
                "useFullSuiteTitle": true
            },
            stdout: directories.target + '/jenkins/test-results.txt',
            timeout: 60000,
            logErrors: true
        },
        src: grunt.option("mochatestspecs").split(",")
    };


    var previous_force_state = grunt.option("force");

    grunt.registerTask("force", function(set) {
        if (set === "on") {
            grunt.option("force", true);
        }
    });

    grunt.registerTask('test:' + name, 'runs the ' + name + ' selenium tests', tasks);
    // grunt.registerTask('test:endtoend', 'runs the selenium tests and creates a report', tasks);
    // grunt.registerTask('test:debug', 'runs the selenium tests and creates a report', tasks);
    // grunt.registerTask('test:jenkins', 'runs tests without generating redoReport', 'mochaTest:endtoend');
    grunt.registerTask('redoReport', 'redoReport', function(grunt) {
        var done = this.async();
        report.redoreport(grunt, function(x) {
            console.log(x);
            done();
        });
    });
    grunt.registerTask('qcRun', 'qcRun', function(grunt) {
        var done = this.async();
        qcUpdates(grunt, function(x) {
            console.log(x);
            done();
        });
    });
    grunt.config.merge(config);
}
