const fs = require("fs");
const https = require("https");
const options = {
  key: fs.readFileSync(`/opt/app-root/certs/tls.key`),
  cert: fs.readFileSync(`/opt/app-root/certs/tls.crt`),
  ca: [
    fs.readFileSync(`/opt/app-root/certs/ca.crt`)
  ],
  // Requesting the client to provide a certificate, to authenticate.
  requestCert: true,
  // As specified as "true", so no unauthenticated traffic
  // will make it to the specified route specified
  rejectUnauthorized: true
};
https
  .createServer(options, function(req, res) {
    console.log(
      new Date() +
        " " +
        req.connection.remoteAddress +
        " " +
        req.method +
        " " +
        req.url
    );
    res.writeHead(200);
    res.end("OK!\n");
  })
  .listen(3001);

