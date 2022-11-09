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

```
oc new-project client
oc apply -f client/manifests/ -n client
```
 
# Attribution
I want to thank you to the author of [this blog](https://www.matteomattei.com/client-and-server-ssl-mutual-authentication-with-nodejs/) for providing easy to follow instructions, which enabled me to complete this poc. 
