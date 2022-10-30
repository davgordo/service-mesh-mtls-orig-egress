# Introduction
This is a quick PoC to demonstrate two node, client and server, applications running on openshift and using mTLS for communication. The server can only be reached by proper certificates and the clien is just a proxy that will provide certificates and redirect the responss to its response.

 
## Create certificates
### server
Before executing the following command find server hostname, if you are running this on Openshift local then it might be `apps-crc.testing`. You will need to put `apps-crc.testing` when prompted for `Common Name`.
```
openssl req -new -x509 -days 365 -keyout server-ca-key.pem -out server-ca-crt.pem
```

```
openssl genrsa -out server-key.pem 4096
```

Before executing the following command you will need to figure out what route are you planning to user for the server, In my case it was `server-demo1.apps-crc.testing`. So, you will need to put `server-demo1.apps-crc.testing` when prompted for `Common Name`.
```
openssl req -new -sha256 -key server-key.pem -out server-csr.pem
```

```
openssl x509 -req -days 365 -in server-csr.pem -CA server-ca-crt.pem -CAkey server-ca-key.pem -CAcreateserial -out server-crt.pem
openssl verify -CAfile server-ca-crt.pem server-crt.pem
```

### client
Before executing the following command find server hostname, if you are running this on Openshift local then it might be `apps-crc.testing`. You will need to put `apps-crc.testing` when prompted for `Common Name`.
```
openssl req -new -x509 -days 365 -keyout client-ca-key.pem -out client-ca-crt.pem
```

```
openssl genrsa -out client-key.pem 4096
```


Before executing the following command you will need to figure out what route are you planning to user for the client, In my case it was `client-demo1.apps-crc.testing`. So, you will need to put `client-demo1.apps-crc.testing` when prompted for `Common Name`.
```
openssl req -new -sha256 -key client-key.pem -out client-csr.pem
```

```
openssl x509 -req -days 365 -in client-csr.pem -CA client-ca-crt.pem -CAkey client-ca-key.pem -CAcreateserial -out client-crt.pem
openssl verify -CAfile client-ca-crt.pem client-crt.pem
```

## Create Project

```
oc new-project demo1
```

## Create secrets
```
oc create secret generic server-certs --from-file=server-key.pem --from-file=server-crt.pem --from-file=client-ca-crt.pem 
oc create secret generic client-certs --from-file=client-key.pem --from-file=client-crt.pem --from-file=server-ca-crt.pem 

cat client-crt.pem server-ca-crt.pem > client.pem
openssl pkcs12 -export -out client.p12 -in client.pem -inkey client-key.pem -passin pass:pass123 -passout pass:pass123

oc create secret generic clientp12 --from-file=client.p12

```

Create secret to save passphrase for client
```
oc create secret generic server-secret --from-literal=passphrase=pass123

```

Create configmap to save host url
```
oc create cm server-config --from-literal=host=server-<project>.<host-url>
```

## Create Server
```
oc new-build --binary --name server --strategy docker
oc start-build server --from-dir=./server
oc apply -f server/manifests
```

## Create Client
Modify `client/manifest/index.js` to point to proper host before applying them.

```
oc new-build --binary --name client --strategy docker
oc start-build client --from-dir=./client
oc apply -f client/manifests
```

## Note
I want to thank you to the author of [this blog](https://www.matteomattei.com/client-and-server-ssl-mutual-authentication-with-nodejs/) for providing easy to follow instructions, which enabled me to complete this poc. 


