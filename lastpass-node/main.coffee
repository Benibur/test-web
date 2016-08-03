Lastpass             = require './lastpass-client'
username             = 'ben@sonadresse.com'
password             = 'toto32toto32'
multifactor_password = null

Lastpass.Vault.open_remote username, password, multifactor_password, (vault)->
    console.log 'finaly the vault is :', vault
