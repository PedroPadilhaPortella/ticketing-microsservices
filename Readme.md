> docker build -t pedropadilhaportella/posts .
> docker build -t pedropadilhaportella/event-bus .
> docker build -t pedropadilhaportella/comments .
> docker build -t pedropadilhaportella/moderation .
> docker build -t pedropadilhaportella/query .
> docker build -t pedropadilhaportella/client .

> docker push pedropadilhaportella/posts
> docker push pedropadilhaportella/event-bus
> docker push pedropadilhaportella/comments
> docker push pedropadilhaportella/moderation
> docker push pedropadilhaportella/query
> docker push pedropadilhaportella/client

> kubectl rollout restart deployment posts-deployment
> kubectl rollout restart deployment event-bus-deployment

> kubectl apply -f posts-deployment.yaml
> kubectl apply -f event-bus-deployment.yaml
> kubectl apply -f comments-deployment.yaml
> kubectl apply -f moderation-deployment.yaml
> kubectl apply -f query-deployment.yaml
> kubectl apply -f client-deployment.yaml

> kubectl apply -f posts-service.yaml

> kubectl apply -f ingress-service.yaml

> kubectl get pods
> kubectl get deployments
> kubectl get services