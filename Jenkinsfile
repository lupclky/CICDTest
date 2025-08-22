pipeline {
    agent any
    
    triggers {
        // Automatically trigger build on SCM changes (webhook)
        githubPush()
        // Or use pollSCM for regular polling: pollSCM('H/5 * * * *') // Check every 5 minutes
    }

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials' // Jenkins credential ID for Docker Hub
        DOCKERHUB_USERNAME       = 'powder2810'  // Thay bằng username Docker Hub của bạn
        IMAGE_NAME               = "${env.DOCKERHUB_USERNAME}/simple-web:${env.BUILD_NUMBER}"
        SSH_CREDENTIALS_ID       = 'server2-ssh-key'      // Jenkins credential ID for Server 2's private key
    }

    parameters {
        string(name: 'SERVER2_IP', defaultValue: '', description: 'Public IP of Server 2 for deployment')
        string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Git branch to checkout and build')
        string(name: 'GIT_REPO_URL', defaultValue: '', description: 'GitHub repository URL (if different from SCM)')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Cleaning workspace and checking out source code from Git..."
                
                // Clean workspace to ensure fresh start
                deleteDir()
                
                script {
                    if (params.GIT_REPO_URL?.trim()) {
                        // Use custom repository URL if provided
                        echo "Checking out from custom repository: ${params.GIT_REPO_URL}"
                        echo "Branch: ${params.GIT_BRANCH}"
                        
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: "*/${params.GIT_BRANCH}"]],
                            userRemoteConfigs: [[url: "${params.GIT_REPO_URL}"]]
                        ])
                    } else {
                        // Use default SCM configuration
                        echo "Checking out from default SCM configuration"
                        echo "Branch: ${params.GIT_BRANCH}"
                        
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: "*/${params.GIT_BRANCH}"]],
                            userRemoteConfigs: scm.userRemoteConfigs
                        ])
                    }
                }
                
                // Display current commit information
                script {
                    def gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    def gitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    echo "Current commit: ${gitCommit}"
                    echo "Commit message: ${gitMessage}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}"
                script {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Scan Image with Trivy') {
            steps {
                echo "Scanning Docker image for vulnerabilities..."
                // Scan but don't fail pipeline for demo purposes
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${IMAGE_NAME} || echo 'Trivy scan completed with warnings'"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing image to Docker Hub..."
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                    sh "docker push ${IMAGE_NAME}"
                }
            }
        }

        stage('Deploy to Server 2 with Ansible') {
            steps {
                echo "Deploying to Server 2 at ${params.SERVER2_IP} using Ansible..."
                withCredentials([
                    sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER'),
                    usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    // Create a dynamic inventory file for Ansible
                    sh "echo '[app_server]' > inventory"
                    sh "echo '${params.SERVER2_IP} ansible_user=${SSH_USER} ansible_ssh_private_key_file=${SSH_KEY}' >> inventory"

                    // Run the Ansible playbook, passing credentials securely
                    sh "ansible-playbook -i inventory deploy.yml --extra-vars 'image_name=${IMAGE_NAME} docker_user=${DOCKER_USER} docker_pass=\"${DOCKER_PASS}\"'"
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace and log out
            deleteDir()
            sh "docker logout"
        }
        
        success {
            echo "🎉 Deployment successful!"
            echo "✅ Application deployed to Server 2 at ${params.SERVER2_IP}"
            echo "🐳 Docker image: ${IMAGE_NAME}"
            
            // Optional: Send notification (uncomment if you have notification setup)
            // slackSend(channel: '#deployments', 
            //          color: 'good', 
            //          message: "✅ Deployment successful: ${IMAGE_NAME} deployed to ${params.SERVER2_IP}")
        }
        
        failure {
            echo "❌ Deployment failed!"
            echo "🔍 Check the logs above for details"
            
            // Optional: Send failure notification
            // slackSend(channel: '#deployments', 
            //          color: 'danger', 
            //          message: "❌ Deployment failed: ${IMAGE_NAME} - Check Jenkins logs")
        }
    }
}
