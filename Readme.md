> docker build -t pedropadilhaportella/auth .
> docker build -t pedropadilhaportella/client .
> docker build -t pedropadilhaportella/tickets .
> docker build -t pedropadilhaportella/orders .

> docker push pedropadilhaportella/auth
> docker push pedropadilhaportella/client
> docker push pedropadilhaportella/tickets
> docker push pedropadilhaportella/orders

> kubectl apply -f auth-deployment.yaml
> kubectl apply -f auth-mongodb-deployment.yaml
> kubectl apply -f client-deployment.yaml
> kubectl apply -f tickets-deployment.yaml
> kubectl apply -f tickets-mongodb-deployment.yaml
> kubectl apply -f nats-deployment.yaml
> kubectl apply -f orders-deployment.yaml
> kubectl apply -f orders-mongodb-deployment.yaml

> kubectl apply -f ingress-service.yaml

> kubectl rollout restart deployment auth-deployment
> kubectl rollout restart deployment auth-mongodb-deployment
> kubectl rollout restart deployment client-deployment
> kubectl rollout restart deployment tickets-deployment
> kubectl rollout restart deployment tickets-mongodb-deployment
> kubectl rollout restart deployment nats-deployment
> kubectl rollout restart deployment orders-deployment
> kubectl rollout restart deployment orders-mongodb-deployment

> kubectl create secret generic jwt-secret --from-literal=JWT_KEY=ticketing

> kubectl port-forward <pod-name> 4222:4222

> kubectl get pods
> kubectl get deployments
> kubectl get services
> kubectl get ingress
> kubectl get secrets