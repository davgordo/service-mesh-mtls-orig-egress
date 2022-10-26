const fs = require("fs");
const httpProxy = require('http-proxy');
httpProxy.createProxyServer({
  target: {
    protocol: 'https:',
    host: 'server-demo1.apps-crc.testing',
    port: 443,
    pfx: fs.readFileSync('/opt/app-root/certs/client.p12'),
    passphrase: 'pass123',
  },
  changeOrigin: true,
}).listen(3001);
