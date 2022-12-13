const fs = require("fs");
const httpProxy = require('http-proxy');
httpProxy.createProxyServer({
  target: {
    protocol: 'http:',
    host: 'server.server.svc.cluster.local',
    port: 80,
  },
  changeOrigin: true,
}).listen(3001);
