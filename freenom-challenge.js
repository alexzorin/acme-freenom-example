const freenomdns = require('freenom-dns')

class Challenge {
  static create (options) {
    return new Challenge(options)
  }

  constructor (options) {
    this.options = options
    this.client = freenomdns.init(options.username, options.password)
  }

  getOptions () {
    return this.options
  }

  set (args, domain, challenge, keyAuthz, cb) {
    var txtValue = require('crypto').createHash('sha256').update(keyAuthz || '').digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  
    this.client.dns.setRecord('_acme-challenge.' + domain, 'TXT', txtValue)
      .then((res) => {
        // Sleep here a bit in order for nameservers to be reloaded
        console.log('Updated TXT record, will sleep 2 minutes before continuing ...')
        setTimeout(() => cb(null), 2 * 60 * 1000)
      })
      .catch((err) => {
        console.log(err)
        cb(err)
      })
  }

  get (args, domain, key, cb) {
    cb(null)
  }

  remove (args, domain, challenge, cb) {
    this.client.dns.clearRecord('_acme-challenge.' + domain, 'TXT')
    .then((res) => {
      cb(null)
    })
    .catch((err) => {
      cb(err)
    })
  }
}

module.exports = Challenge