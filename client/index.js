const fs = require("fs");
const httpProxy = require('http-proxy');
httpProxy.createProxyServer({
  target: {
    protocol: 'https:',
    // TODO - change host to your host route
    host: 'server.server.svc.cluster.local',
    port: 443,
    pfx: fs.readFileSync('/opt/app-root/certs/keystore.p12'),
    // TODO - move this to secret and load as env
    passphrase: 'pass123',
  },
  changeOrigin: true,
}).listen(3001);
