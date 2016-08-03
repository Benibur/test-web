
class Blob

    # bytes : a Buffer of bytes
    constructor : (@bytes,@key_iteration_count)->
        @_readChunks()

    _readChunks : () ->
        # Reads chunk from bytes and creates Chunks object with the data read.
        # LastPass blob chunk is made up of 4-byte ID,
        # big endian 4-byte size and payload of that size.
        #
        # Example:
        #   0000: "IDID"
        #   0004: 4
        #   0008: 0xDE 0xAD 0xBE 0xEF
        #   000C: --- Next chunk ---
        currentPosition = 0
        length = @bytes.length
        k = 1
        while currentPosition < length
            id = @bytes.toString('utf8',currentPosition, currentPosition+=4 )
            size = @bytes.readUInt32BE(currentPosition)
            currentPosition += 4
            payload = @bytes.slice(currentPosition, currentPosition+=size)
            chunk =
                id : id
                size : size
                payload : payload
            console.log '--chunk n°', k
            console.log '   id='+id, 'size='+size
            console.log ' ', payload
            k += 1
            @chunks.push(chunk)


    bytes : ''

    key_iteration_count : 0

    chunks : []

    encryption_key : (username, password) ->
        return blobID : "blob_232"




module.exports = Blob
