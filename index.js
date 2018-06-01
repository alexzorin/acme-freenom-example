const path = require('path')
const express = require('express')
const ACME = require('acme-v2/compat').ACME
const freenomPlugin = require('./freenom-challenge')

// Configure me
const config = {
  // Your email so ACME can email you about expiry
  acmeEmail: 'FREENOM_EMAIL_ADDRESS@ADDRESS.ORG',
  // Your Freenom login so that we can update your DNS records
  freenomCredentials: { user: 'FREENOM_EMAIL_ADDRESS@ADDRESS.ORG', password: 'FREENOM_PASSWORD' },
  // What domains should we be issuing certificates for
  freenomDomains: ['express-greenlock-test.ga', 'www.express-greenlock-test.ga']
}

// Create an express application as per usual
const app = express()
app.get('/', (req, res) => { res.send('Hello world!') })

// Configure greenlock-express 
require('greenlock-express').create({
  acme: ACME.create({
    skipChallengeTest: true
  }),
  version: 'draft-11',
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  email: config.acmeEmail,
  agreeTos: true,
  approveDomains: config.freenomDomains,
  configDir: path.join(__dirname, '.acme'),
  app: app,
  challengeType: 'dns-01',
  challenges: {
    'dns-01': freenomPlugin.create({
      username: config.freenomCredentials.user,
      password: config.freenomCredentials.password
    })
  },
  communityMember: false

}).listen(8080, 8443)