# Tuxy

[![NPM version](https://img.shields.io/npm/v/tuxy.svg?style=flat)](https://npmjs.com/package/tuxy) [![NPM downloads](https://img.shields.io/npm/dm/tuxy.svg?style=flat)](https://npmjs.com/package/tuxy)

Tuxy is a super small command line TCP and UDP proxy. It can be installed through yarn or npm.

```bash
npm install -g tuxy
# OR
yarn global add tuxy
```

## Usage

Tuxy is configured with a simple JSON string either from a file or passed in directly on the command line.

Each proxy record must have `type`, `in_port`, `target_port`, and `target_host` properties. The `name` property is optional and will be used in logging output if specified.

### Config File

```bash
tuxy -f myProxies.json
```

#### myProxies.json
```JSON
{
  "proxies": [
    {
      "name": "HTTP proxy",
      "type": "tcp",
      "in_port": 8080,
      "target_port": 80,
      "target_host": "targetHTTPServer"
    },
    {
      "type": "tcp",
      "in_port": 5000,
      "target_port": 8000,
      "target_host": "someserver"
    },
    {
      "name": "other proxy",
      "type": "udp",
      "in_port": 5001,
      "target_port": 3000,
      "target_host": "anotherserver.com"
    }
  ]
}
```

### Command Line

When passing in the proxies on the command line you do not put the proxies key in the JSON string. You just pass in the proxies array.

```bash
tuxy --proxies '[{"type": "tcp", "in_port": 80, "target_port": 80, "target_host": "example.org"}]'
```
