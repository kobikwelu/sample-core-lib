@Library('jenkins-shared-libraries-v2@topic/pqe_node') _
import groovy.json.JsonSlurperClassic
pipeline {
    agent any
	parameters {
        choice(choices: 'build\nbuild-pipeline-extension', description: 'Please select the operation', name: 'operation')
     }
    stages {
      stage('Initialization') {
          steps {
            deleteDir()
            checkout scm
              script {
                echo "[INFO] Loading JSON configuration from : ${env.WORKSPACE}/pipeline.json"
                inputFile = readFile("${env.WORKSPACE}/pipeline.json")
                parsedJson = new JsonSlurperClassic().parseText(inputFile)
                echo "[INFO] Done Loading JSON configuration"
                timer = BuildCause()
            }
          }
      }

      stage('Build NPM'){
        when {
            anyOf {
              environment name: 'operation', value: 'build';
              branch 'PR-*'
            }
      	}
        steps{
            BuildNpm(parsedJson)
            //If using YARN as build tool use below BuildYarn(parsedJson)
        }
      }
      stage('Build Pipeline Extension'){
        when {
           anyOf { branch 'master'}
           anyOf { environment name: 'operation', value: 'build-pipeline-extension' }
        }
        steps{
            BuildPipelineExtension(parsedJson)
        }
      }
  	}
  	post {
		success {
			Notify([message:"SUCCESS",
				build_status: "SUCCESS" ])
		}
		failure {
			Notify([message:"FAILED",
				build_status: "FAILED" ])
		}
	}
}