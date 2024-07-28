/*
 * Jenkinsfile to pull the source code from git, build a docker image
 * using a Dockerfile and push that image to a registry.
 */


pipeline {

  agent any

  environment {
    /*
     * edit the following variables
     */
    
    // the name of your docker image
    dockertag = 'exanta/harmwatch'

    // the registry name
    registry = 'https://registry.hub.docker.com'

    // the credentials to the above registry as stored in Jenkins
    registry_credentials = 'exanta-dockerhub'
  }

  // you probably don't need to edit anything below this line
  stages {
           
    stage('Checkout the source code') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        script {
          image_api = docker.build("${dockertag}-backend", "./backend")
          image_ui = docker.build("${dockertag}-frontend", "./frontend")
        }
      }
    }

    stage('Push') {
      steps {
        script {
          docker.withRegistry(registry, registry_credentials) {
            image_api.push()
            image_ui.push()
          }
        }
      }
    }
  }
}
