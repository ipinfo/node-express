# [<img src="https://ipinfo.io/static/ipinfo-small.svg" alt="IPinfo" width="24"/>](https://ipinfo.io/) IPinfo Node.js Express Client Library

This is the official Node.js Express client library for the [IPinfo.io](https://ipinfo.io) IP address API, allowing you to look up your own IP address, or get any of the following details for an IP:

- [IP to geolocation](https://ipinfo.io/ip-geolocation-api) (city, region, country, postal code, latitude, and longitude)
- [IP to ASN](https://ipinfo.io/asn-api) (ISP or network operator, associated domain name, and type, such as business, hosting, or company)
- [IP to Company](https://ipinfo.io/ip-company-api) (the name and domain of the business that uses the IP address)
- [IP to Carrier](https://ipinfo.io/ip-carrier-api) (the name of the mobile carrier and MNC and MCC for that carrier if the IP is used exclusively for mobile traffic)

Check all the data we have for your IP address [here](https://ipinfo.io/what-is-my-ip).

### Getting Started

You'll need an IPinfo API access token, which you can get by signing up for a free account at [https://ipinfo.io/signup](https://ipinfo.io/signup).

The free plan is limited to 50,000 requests per month, and doesn't include some of the data fields such as IP type and company data. To enable all the data fields and additional request volumes see [https://ipinfo.io/pricing](https://ipinfo.io/pricing)

### Installation

#### npm

```bash
npm install ipinfo-express
```

#### yarn

```bash
yarn add ipinfo-express
```

### Usage

The following is the interface of the middleware function.

The `token` is the string token you get when registered with IPinfo.

The `cache` key is the same as that described in
https://github.com/ipinfo/node#caching.

The `timeout` key is the same as that described in
https://github.com/ipinfo/node#timeouts.

The `ipSelector` is the function that returns the selected IP.

```javascript
ipinfo({
    token: "<token>",
    cache: <cache_class>,
    timeout: 5000,
    ipSelector: null
});
```

### Full Example

The following is a full example of using the middleware function.

```javascript
const express = require('express')
const ipinfo = require('ipinfo-express')

const app = express()
app.use(ipinfo({
    token: "token",
    cache: null,
    timeout: 5000,
    ipSelector: null
}))

app.get('/', function (req, res) {
    res.send(req.ipinfo)
})

app.listen(3000, () => {
    console.log(`Server is running`)
})
```

### IP Selection Mechanism

By default, the IP from the incoming request object is used.

Since the desired IP by your system may be in other locations, the IP selection mechanism is configurable and some alternative built-in options are available.

#### Using built-in IP selectors

- Default IP Selector
- Originating IP Selector

##### Default IP selector

A [defaultIPSelector](https://github.com/ipinfo/node-express/blob/master/src/ip-selector/default-ip-selector.js) function is used by default if no IP selection method is provided. It returns the default IP from the incoming request object of Express.

This selector can be set explicitly by setting the `ipSelector` while setting the middleware function.

```javascript
const ipinfo = require('ipinfo-express')
const { defaultIPSelector } = require('ipinfo-express')

const app = express()
app.use(ipinfo({
    token: "token",
    cache: null,
    timeout: 5000,
    ipSelector: defaultIPSelector
}))
```

##### Originating IP selector

A [originatingIPSelector](https://github.com/ipinfo/node-express/blob/master/src/ip-selector/originating-ip-selector.js) selects an IP address by trying to extract it from the `X-Forwarded-For` header. This is not always the most reliable unless your proxy setup allows you to trust it. It will default to the source IP on the request if the header doesn't exist.

This selector can be set by setting the `ipSelector` while setting the middleware function.

```javascript
const ipinfo = require('ipinfo-express')
const { originatingIPSelector } = require('ipinfo-express')

const app = express()
app.use(ipinfo({
    token: "token",
    cache: null,
    timeout: 5000,
    ipSelector: originatingIPSelector
}))
```

#### Using a custom IP selector

In case a custom IP selector is required, you may set your custom function to `ipSelector`. Your custom function should take [req](https://expressjs.com/en/api.html#req) as an argument and return an IP in `string` format.

For example:

```javascript
const ipinfo = require('ipinfo-express')

const app = express()
app.use(ipinfo({
    token: "token",
    cache: null,
    timeout: 5000,
    ipSelector: (req) => {
        ip = ""
        // update ip according to your logic and return the selected IP
        return ip
    }
}))
```

### Other Libraries

There are official IPinfo client libraries available for many languages including PHP, Go, Java, Ruby, and many popular frameworks such as Django, Rails, and Laravel. There are also many third-party libraries and integrations available for our API.

### About IPinfo

Founded in 2013, IPinfo prides itself on being the most reliable, accurate, and in-depth source of IP address data available anywhere. We process terabytes of data to produce our custom IP geolocation, company, carrier, VPN detection, hosted domains, and IP type data sets. Our API handles over 20 billion requests a month for 100,000 businesses and developers.

[![image](https://avatars3.githubusercontent.com/u/15721521?s=128&u=7bb7dde5c4991335fb234e68a30971944abc6bf3&v=4)](https://ipinfo.io/)
