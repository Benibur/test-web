Fetcher  = require './Fetcher.coffee'
# Parser   = require './Parser'

# Just fetches the blob, could be used to store it locally
_fetch_blob = (username, password, multifactor_password, cb) ->
    Fetcher.login username, password, multifactor_password, (session)->
        console.log '_fetch_blob()', 'login session=', session
        Fetcher.fetch_blob(session, cb)

# Creates a vault from a blob object
_open_blob : (blob, username, password) ->
    console.log '\nVault._open_blob', blob
    key = Fetcher.make_key(username, password, blob.key_iteration_count)
    for chunk in blob.chunks
        console.log '\n==== chunk.id:', chunk.id
        if chunk.id == "ACCT"
            Parser.parse_ACCT(chunk, key)


    return blob.encryption_key(username, password)


LastpassClient =

    # Fetches a blob from the server and creates a vault
    open_remote : (username, password, multifactor_password, cb)->
        console.log 'open_remote(', username, password, multifactor_password, ')'
        _fetch_blob username, password, multifactor_password, (blob)=>
            console.log 'Vault.open_remote', this
            @blob = blob
            # _open_blob(blob, username, password)
            cb( this )




module.exports = LastpassClient
