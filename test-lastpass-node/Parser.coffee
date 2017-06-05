crypto = require('crypto')

# Guesses AES cipher (EBC or CBD) from the length of the plain data.
decode_aes256_plain_auto = (data, encryption_key)->
    if data.length == 0
        return ''
    debugger
    if data.toString('utf8', 0,1) == '!' and data.length % 16 == 1 and data.length > 32
        console.log "on choisi decode_aes256_cbc_plain"
        return decode_aes256_cbc_plain(data, encryption_key)
    else
        console.log "on choisi decode_aes256_ecb_plain"
        return decode_aes256_ecb_plain(data, encryption_key)


# Guesses AES cipher (EBC or CBD) from the length of the base64 encoded data.
decode_aes256_base64_auto = (data, encryption_key)->
    length = data.length

    if length == 0
        return ''
    else if data.toString('utf8', 0,0) == '!'
        return decode_aes256_cbc_base64(data, encryption_key)
    else
        return decode_aes256_ecb_base64(data, encryption_key)


# Decrypts AES-256 ECB bytes.
decode_aes256_cbc_plain = (data, encryption_key)->
    if not data
        return ''
    else
        # LastPass AES-256/CBC encryted string starts with an "!".
        # Next 16 bytes are the IV for the cipher.
        # And the rest is the encrypted payload.
        return decode_aes256('cbc', data.slice(1,17), data.slice(17), encryption_key)


# Decrypts AES-256 ECB bytes
decode_aes256_ecb_plain = (data, encryption_key)->
    if not data
        return ''
    else
        return decode_aes256('ecb', '', data, encryption_key)


# Decrypts base64 encoded AES-256 ECB bytes
decode_aes256_ecb_base64 = (data, encryption_key)->
    return decode_aes256_ecb_plain(decode_base64(data), encryption_key)


# Decrypts base64 encoded AES-256 CBC bytes.
decode_aes256_cbc_base64 = (data, encryption_key)->
    if not data
        return ''
    else
        # LastPass AES-256/CBC/base64 encryted string starts with an "!".
        # Next 24 bytes are the base64 encoded IV for the cipher.
        # Then comes the "|".
        # And the rest is the base64 encoded encrypted payload.
        return decode_aes256(
            'cbc',
            decode_base64(data.slice(1,25)),
            decode_base64(data.slice(26)),
            encryption_key)


# Decrypt AES-256 bytes.
# Allowed ciphers are: :ecb, :cbc.
# If for :ecb iv is not used and should be set to "".
decode_aes256 = (cipher, iv, data, encryption_key)->
    if cipher == 'cbc'
        algorithm = 'AES-256-CBC'
    else if cipher == 'ecb'
        algorithm = 'AES-256-ECB'
    console.log '==__ decode_aes256'
    console.log 'algorithm', algorithm
    console.log 'encryption_key', encryption_key
    console.log 'iv', iv
    console.log 'data', data
    debugger
    if iv == ''
        decipher = crypto.createDecipher(algorithm, encryption_key)
    else
        decipher = crypto.createDecipheriv(algorithm, encryption_key, iv)
    d  = decipher.update(data)
    debugger
    d += decipher.final()
    console.log 'decrpted data', d
    # # http://passingcuriosity.com/2009/aes-encryption-in-python-with-m2crypto/
    # unpad = lambda s: s[0:-ord(d[-1:])]
    return d


class PayloadSlicer
    constructor:(payload) ->
        @length = payload.length
        @payload = payload
        @currentPosition = 0
        console.log 'chunk length:', @length

    next_item:() ->
        if  @length <= @currentPosition
            return null

        itemSize = @payload.readUInt32BE(@currentPosition)
        @currentPosition += 4
        item = @payload.slice(@currentPosition, @currentPosition+=itemSize)
        return item


Parser =

    parse_ACCT : (chunk, key)->
        console.log '== ACCT chunk length:'
        items = []
        slicer = new PayloadSlicer(chunk.payload)
        # other items :
        while item = slicer.next_item()
            items.push(item)
            # console.log item.length
            # items.push({size: item.length, item: item.toString()})
        console.log  'items', items

        # prepare each
        account = {}
        account.id = items[0]
        account.name = decode_aes256_plain_auto(items[1], key)
        account.group = decode_aes256_plain_auto(items[2], key)
        account.url =  items[3] # decode_hex(read_item(io))
        account.notes = decode_aes256_plain_auto(items[4], key)
        # skip_item(io, 2)
        account.username = decode_aes256_plain_auto(items[7], key)
        account.password = decode_aes256_plain_auto(items[8], key)
        # skip_item(io, 2)
        account.secure_note = items[11]

        console.log account

        return account



module.exports = Parser
