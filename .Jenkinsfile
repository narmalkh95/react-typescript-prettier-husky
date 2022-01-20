pipeline {

    agent any

    options {
        buildDiscarder(
            logRotator(
                daysToKeepStr: '30',
                artifactDaysToKeepStr: '15',
                artifactNumToKeepStr: '15'
            )
        ) // Save disk space
        durabilityHint('PERFORMANCE_OPTIMIZED')
        timeout(time: 480, unit: 'MINUTES') // Timeout for pipeline
    }

    environment {
        CI = 'false'
        GIT_REPO_NAME = "${env.GIT_URL.replaceFirst(/^.*\/([^\/]+?).git$/, '$1')}"
        HOSTNAME = "${env.GIT_REPO_NAME} + '-' + ${(env.CHANGE_ID) ? 'pr' + env.CHANGE_ID : env.GIT_BRANCH_NAME}"
        REACT_APP_API_URL="https://dev.app.manot.tech/api/v1/"

    }
    
    stages {
        stage('Build') {
            steps {
                sh label: "Installing packages...", script: 'npm ci --prefer-offline'
                sh label: "Building...", script: 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                withCredentials([sshUserPrivateKey(credentialsId: "worker-key", keyFileVariable: 'workerkey')]) {
                    sh '''ssh -i ${workerkey} -o StrictHostKeyChecking=no ubuntu@3.238.39.84 sudo rm -rf /var/www/dev-manot-ui/* /home/ubuntu/www/dev-manot-ui/* || true ;
                        scp -i ${workerkey} -r ${WORKSPACE}/build/* ubuntu@3.238.39.84:/home/ubuntu/www/dev-manot-ui/ ;
                        ssh -i ${workerkey} -o StrictHostKeyChecking=no ubuntu@3.238.39.84 sudo cp -r /home/ubuntu/www/dev-manot-ui/* /var/www/dev-manot-ui/ '''
                }
            }
        }
    }
}
