pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials' // Jenkins credential ID for Docker Hub
        DOCKERHUB_USERNAME       = 'powder2810'
        IMAGE_NAME               = "${env.DOCKERHUB_USERNAME}/simple-web:${env.BUILD_NUMBER}"
        SSH_CREDENTIALS_ID       = 'server2-ssh-key'      // Jenkins credential ID for Server 2's private key
    }

    parameters {
        string(name: 'SERVER2_IP', defaultValue: '', description: 'Public IP of Server 2 for deployment')
    }

    stages {
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
                // Fail the pipeline if any HIGH or CRITICAL vulnerabilities are found
                sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${IMAGE_NAME}"
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
            cleanWs()
            sh "docker logout"
        }
    }
}
