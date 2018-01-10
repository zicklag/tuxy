#!/usr/bin/env node
const TCPProxy = require('tcp-proxy.js')
const UDPProxy = require('udp-proxy')
const yargs = require('yargs')
const createLogger = require('logging').default
const programLogger = createLogger('proxy.js')

function start_proxy(proxies) {
  programLogger.info("Starting proxy(s)")

  for (let proxy of proxies) {
    if (proxy.name == undefined) {
      proxy.name = `${proxy.type} ${proxy.in_port} -> ${proxy.target_host}:${proxy.target_port}`
    }

    let proxyLogger = createLogger(`proxy.js:${proxy.name}`)
    proxyLogger.info('Starting proxy')

    if (proxy.type == 'tcp') {
      var tcpProxy = new TCPProxy({ port: proxy.in_port})
      tcpProxy.createProxy({
        forwardPort: proxy.target_port,
        forwardHost: proxy.target_host
      }).then(() => {
        proxyLogger.info('Successfully started')
      }).catch(err => {
        proxyLogger.error(err)
      })
    }
    else if (proxy.type == 'udp') {
      let server = UDPProxy.createServer({
        localaddress: '0.0.0.0',
        localport: proxy.in_port,
        address: proxy.target_host,
        port: proxy.target_port
      })

      server.on('listening', details => {
        proxyLogger.info("Successfully started")
      })

      server.on('error', err => {
        proxyLogger.error(err)
      })
    }
    else {
      proxyLogger.error(`Unrecognized proxy type, '${proxy.type}'. Ignoring record, '${proxy.name}'.`)
    }
  }
}

/**
 * Commandline Interface
 */
yargs
  .usage(
    '$0 [-f <json-config-file>] [-j <json-config-string>]',
    'Start a micro tcp/udp proxy server that routes local ports to a remote host.',
    (yargs) => {
      yargs
        .group(['file', 'proxies'], 'Proxy Options:')
        .example('$0 -f proxies.json')
        .example('$0 -j \'[{"type": "tcp", "in_port": 80, "target_port": 80, "target_host": "example.org"}]\'')
        .option('file', {
          alias: 'f',
          describe: 'JSON proxy config file',
          config: true
        })
        .option('proxies', {
          alias: ['j', 'json'],
          describe: 'JSON object describing proxies to create',
          coerce: arg => {
            if (typeof arg == 'string') {
              return JSON.parse(arg)
            }
            else if (typeof arg == 'object') {
              return arg
            }
            else {
              // Technically we should never be able to get here, but just in
              // case.
              throw Error('Invalid type for proxies argument')
            }
          }
        })
        .check((argv, opts) => {
          if (argv.file == null && argv.proxies == null) {
            throw Error("Either proxies or file arguments must be specified")
          } else {
            return true
          }
        })
    },
    // App entrypoint
    (argv) => {
      start_proxy(argv.proxies)
    }
  )
  .help()
  .alias('h', 'help')
  .argv
