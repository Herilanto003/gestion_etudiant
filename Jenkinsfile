pipeline {
    agent any

    environment {
        REGISTRY = "herylanto"
        BACKEND_IMAGE = "${env.REGISTRY}/backend:latest"
        FRONTEND_IMAGE = "${env.REGISTRY}/frontend:latest"
        ANSIBLE_DIR = "ansible"
        DATABASE_URL = credentials('DATABASE_URL')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Herilanto003/gestion_etudiant.git'
            }
        }
        
        stage('Migration Prisma') {
            steps {
                sh """
                cd backend && npx prisma migrate deploy
                """
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t ${BACKEND_IMAGE} ./backend
                docker build -t ${FRONTEND_IMAGE} ./frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKER_AUTH',
                                                 usernameVariable: 'DOCKER_USER',
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push ${BACKEND_IMAGE}
                    docker push ${FRONTEND_IMAGE}
                    '''
                }
            }
        }

        stage('Run Prisma Migration') {
            steps {
                 sh """
                    kubectl apply -f k8s/jobs/prisma-migrate-job.yaml --kubeconfig k8s/jobs/k3s.yaml
                """
            }
        }

        stage('Deploy to k3s') {
            steps {
                ansiblePlaybook(
                    playbook: 'ansible/deploy.yaml',
                    inventory: 'ansible/inventory',
                    tags: 'deploy',
                    colorized: true,
                    become: true,
                    becomeUser: 'root',
                    extraVars: [ansible_become_pass: '  ']
                )
            }
        }
    }

    post {
        success {
            echo "Déploiement réussi 🚀"
        }
        failure {
            echo "❌ Le pipeline a échoué"
        }
    }
}
