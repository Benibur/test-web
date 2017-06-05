crypto = require('crypto')

password = "toto32toto32"
username = "ben@sonadresse.com"
key_iteration_count = 5000

debugger

# PBKDF2(password.encode(), username.encode(), 32, key_iteration_count, prf)

key = crypto.pbkdf2Sync password,username,key_iteration_count, 32, 'sha256'

console.log "key",key, key.toString('hex')
