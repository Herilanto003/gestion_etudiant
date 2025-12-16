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
                docker build --no-cache -t ${BACKEND_IMAGE} ./backend
                docker build --no-cache -t ${FRONTEND_IMAGE} ./frontend
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

        stage('Deploy backend') {
            steps {
                 sh """
                    kubectl set image deployment/backend backend=${BACKEND_IMAGE} --kubeconfig k8s/jobs/k3s.yaml
                """
            }
        }

        stage('Deploy frontend') {
            steps {
                 sh """
                    kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE} --kubeconfig k8s/jobs/k3s.yaml
                """
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
