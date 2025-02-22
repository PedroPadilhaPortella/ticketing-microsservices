> docker build -t pedropadilhaportella/auth .

> docker push pedropadilhaportella/auth

> kubectl apply -f auth-deployment.yaml
> kubectl apply -f auth-mongodb-deployment.yaml

> kubectl apply -f ingress-service.yaml

> kubectl rollout restart deployment auth-deployment
> kubectl rollout restart deployment auth-mongodb-deployment

> kubectl create secret generic jwt-secret --from-literal=JWT_KEY=ticketing

> kubectl get pods
> kubectl get deployments
> kubectl get services
> kubectl get secrets