# Istio Egress mTLS Origination with OpenShift Service Mesh

This is a demo of mTLS origination at an Istio egress gateway. Access to the server is authorized only if the client presents a certificate that it trusts. The client is a simple proxy that will send a request to the server and return its response.

## Provisioning

The following instructions describe how to provision this demo in an OpenShift cluster.

### Provision certificate management

1. Install the Red Hat OpenShift Certificate Manager operator.
2. Provision the certificate issuers
```
oc apply -f cert-manager/ -n openshift-cert-manager
```

### Provision the server

```
oc new-project server
oc apply -f server/manifests/ -n server
```

### Provision the traditional client (optional)

This is an example of traditional client identity instrumentation provided as a comparison. A keystore secret is mounted directly to the application pod and consumed by the application to secure the request.

```
oc new-project client
oc apply -f client/manifests/ -n client
```

### Provision a service mesh control plane

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

### Configure a service mesh member

```
oc new-project client-mesh
oc apply -f istio-system/ServiceMeshMemberRoll_default.yaml -n istio-system
```

### Provision a certificate for mTLS origination

```
oc apply -f istio-system/Secret_client-tls.yaml -f istio-system/Certificate_client-tls.yaml -n istio-system
```

### Provision the client inside the service mesh

```
oc apply -f client-mesh/manifests/ -n client-mesh
```

## Attribution
JavaScript examples: [Matteo Mattei](https://www.matteomattei.com/client-and-server-ssl-mutual-authentication-with-nodejs/)