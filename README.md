# acme-freenom-example

An example project that uses Greenlock + Express + Freenom DNS to automatically issue Let's Encrypt certificates via the v2 API.

While this *technically* works, it has the giant caveat that the Freenom DNS API can take multiple minutes to start advertising
newly updated records.

Because of the design of Greenlock, this means there is a multi-minute delay PER domain when issuing certificates.

For this reason, it's probably preferable to host your domain's nameservers somewhere sane (like Cloudflare) and use the Greenlock
Cloudflare plugin instead.

## Usage

Configure this in `index.js`:

```js
// Configure me
const config = {
  // Your email so ACME can email you about expiry
  acmeEmail: 'YOUR-VALID-EMAIL@ADDRESS.ORG',
  // Your Freenom login so that we can update your DNS records
  freenomCredentials: { user: 'freenom username', password: 'freenom password' },
  // What domains should we be issuing certificates for
  freenomDomains: ['express-greenlock-test.ga', 'www.express-greenlock-test.ga']
}
```

The DNS delay can be tuned in `freenom-challenge.js`:

```js
        setTimeout(() => cb(null), 2 * 60 * 1000)
```