crypto = require('crypto')
Blob   = require('./Blob')
request = require('request')

request_iteration_count = (username, cb) ->
    options =
        url : 'https://lastpass.com/iterations.php'
        json : true
        body : 'email': username
    response = request options, (err, resp, body) ->
        # console.log err
        console.log 'request_iteration_count response body', body
        cb(body)

create_session = (body_response, key_iteration_count) ->
    tagRegExp = /<([\w]*) /i
    tag = tagRegExp.exec(body_response)[1]
    sessionidRegExp = new RegExp("sessionid=\"([^\"]*)\"",'i')
    sessionid = sessionidRegExp.exec(body_response)[1]
    return {id: sessionid, key_iteration_count: key_iteration_count}

make_hash = (username, password, key_iteration_count) ->
    console.log 'make_hash(',username, password, key_iteration_count, ')'
    if key_iteration_count == 1
        console.log "make_hash in case of key_iteration_count==1 to be implemented"
        # TODO

    else
        key = make_key(username, password, key_iteration_count)
        hash = crypto.pbkdf2Sync(
            key,
            password,
            1,
            32,
            'sha256').toString('hex')
        console.log " hash", hash
        return hash

make_key = (username, password, key_iteration_count)->
    console.log "make_key()", username, password, key_iteration_count,")"
    if key_iteration_count == 1
        console.log " case key_iteration_count == 1"
    else
        # PBKDF2(password.encode(), username.encode(), 32, key_iteration_count, prf)
        key = crypto.pbkdf2Sync password,username,key_iteration_count, 32, 'sha256'
        console.log "  =>",key, key.toString('hex')
        return key

request_session = (username, password, key_iteration_count, multifactor_password, cb) ->
    console.log 'request_session(', username, password, key_iteration_count, multifactor_password, ')'
    options =
        url   : 'https://lastpass.com/login.php'
        json  : true
        form  :
            method     : 'mobile'
            web        : 1
            xml        : 1
            username   : username
            hash       : make_hash(username, password, key_iteration_count)
            iterations : key_iteration_count
    console.log "session request about to be sent with options =", options
    request.post options, (err, resp, body) ->
        console.log err
        console.log 'login body :', body
        session = create_session(body, key_iteration_count)
        cb(session)
    # cb({id:'sDlQZ3YOe,4EYv3Xx7310uRf7Ud', key_iteration_count:key_iteration_count})


Fetcher = {}

Fetcher.make_key = make_key

Fetcher.login = (username, password, multifactor_password, cb) ->
    console.log 'Fetcher.login(', username, password, multifactor_password, ')'

    # TODO BJA : remettre le fetch du nbr d'itération (désactivé pour ne pas se faire banner)
    # request_iteration_count username, (key_iteration_count)->
    #     request_session(username, password, key_iteration_count, multifactor_password, cb)
    request_session(username, password, 5000, multifactor_password, cb)


Fetcher.fetch_blob = (session, cb) ->
    console.log "-- on veut Fetcher.fetch_blob() ! ! !"
    j = request.jar()
    cookie = request.cookie('PHPSESSID=' + session.id)
    url = 'https://lastpass.com'
    j.setCookie(cookie, url)
    response = request.get
        url : 'https://lastpass.com/getaccts.php?mobile=1&b64=1&hash=0.0&hasplugin=3.0.23&requestsrc=android'
        jar : j
        , (err, resp, body)->
            # convert the string encoded in base64 in a buffer in order to easily manipulate the bytes.
            bytes = new Buffer(body, 'base64')
            cb(new Blob(bytes, session.key_iteration_count))

    # if response.status_code != requests.codes.ok:
    #     raise NetworkError()
    #
    # return blob.Blob(decode_blob(response.content), session.key_iteration_count)



module.exports = Fetcher
