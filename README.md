# Introduction
This is a quick PoC to demonstrate Node.js client and server applications running on openshift and using mTLS for communication. The server can only be accessed if presented with a certificate from the client which is signed by a authority known to the server. The client is a simple proxy that will send a request to the server and include the server's response in its own.

# Provisioning

The following instuctions describe how to provision this demo in an OpenShift cluster.

## Provision certificate management

1. Install the Red Hat OpenShift Certificate Manager operator.
2. Provision the certificate issuers
```
oc apply -f cert-manager/ -n openshift-cert-manager
```

## Provision the server

```
oc new-project server
oc apply -f server/manifests/ -n server
```

## Provision the client

Note: This client demonstrates the runtime instrumentation needed for a client without the use of a service mesh. A second client instance is provided that leverages service mesh configuration.

```
oc new-project client
oc apply -f client/manifests/ -n client
```

## Provision a service mesh control plane

1. Install Elasticsearch operator all namespaces
2. Install OpenShift Distributed Tracing operator all namespaces
3. Install Kiali operator all namespaces
4. Install OpenShift Service Mesh operator all namespaces
5. Create a namespace for the service mesh control plane
5. Provision a control plane (see below)

```
oc new-project istio-system
oc apply -f istio-system/ServiceMeshControlPlane_basic.yaml -n istio-system
```

## Configure a service mesh member

```
oc new-project client-mesh
oc apply -f istio-system/ServiceMeshMemberRoll_default.yaml -n istio-system
```

## Provision certificate for mTLS origination

```
oc apply -f istio-system/Secret_client-tls.yaml -f istio-system/Certificate_client-tls.yaml -n istio-system
```

## Provision the client inside the service mesh

```
oc apply -f client-mesh/manifests/ -n client-mesh
```

# Attribution
I want to thank you to the author of [this blog](https://www.matteomattei.com/client-and-server-ssl-mutual-authentication-with-nodejs/) for providing easy to follow instructions, which enabled me to complete this poc. 
