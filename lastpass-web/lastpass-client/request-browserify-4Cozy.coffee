request = require("browser-request")

requestBrowserify4Cozy = (opts, cb) ->
    # stringigy opts
    optsStr = JSON.stringify(opts)

    # send opts to the proxy which will send the request to the target server, wait for the prowy answer which will be passed to the callback.
    options =
        url  : '/cozy-request-proxy'
        json : true
        body : 'email': usernameœ
        verbose : true # request-browserify specific option for logs : TODO BJA : remove when finished
    request options, (err, resp, body) ->
        # console.log err
        console.log '_request_iteration_count response body', body
        cb(body)


    #


requestBrowserify4Cozy.


module.exports = requestBrowserify4Cozy
