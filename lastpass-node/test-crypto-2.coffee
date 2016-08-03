crypto    = require('crypto')
algorithm = 'aes-256-cbc'
iv        = Buffer.from([0xb1,0xba,0x84,0x6b,0x23,0x8f,0xbd,0x4e,0x2f,0xc2,0x77,0xb1,0x13,0x6c,0xa8,0x61])
password  = Buffer.from([0xf3, 0xe4, 0x55, 0x26, 0xa6, 0x2f, 0xd7, 0xbb, 0x2e, 0x7d, 0x3f, 0xb3, 0xc9, 0x18, 0x6a, 0x36, 0x54, 0xc8, 0x6d, 0x65, 0x46, 0x66, 0x89, 0x1b, 0x32, 0xf2, 0xc1, 0x9b, 0x02, 0x18, 0x92, 0xdf])

encrypt = (buffer)->
  cipher = crypto.createCipheriv(algorithm,password, iv)
  crypted = Buffer.concat([cipher.update(buffer),cipher.final()])
  return crypted

decrypt = (buffer)->
  decipher = crypto.createDecipheriv(algorithm,password, iv)
  dec = Buffer.concat([decipher.update(buffer) , decipher.final()])
  return dec


# test de base
# data = "hello world"
# encrypted = encrypt(new Buffer(data, "utf8"))
# decrypted = decrypt(encrypted).toString('utf8')
#
# console.log 'cas 1: data="'+ data + '"'
# console.log 'encrypted', encrypted
# console.log 'decrypted', decrypted


### ###
# test de cryptage pour lastpass
# but : on part de la data en clair pour obtenir le buffer récupéré de lastpass

###
algorithm AES-256-CBC
encryption_key : identique à celle récupéré via le client python
    <Buffer f3 e4 55 26 a6 2f d7 bb 2e 7d 3f b3 c9 18 6a 36 54 c8 6d 65 46 66 89 1b 32 f2 c1 9b 02 18 92 df>
    [0xf3,0xe4,0x55,0x26,0xa6,0x2f,0xd7,0xbb,0x2e,0x7d,0x3f,0xb3,0xc9,0x18,0x6a,0x36,0x54,0xc8,0x6d,0x65,0x46,0x66,0x89,0x1b,0x32,0xf2,0xc1,0x9b,0x02,0x18,0x92,0xdf]
iv : identique à celui récupéré par le client en python
    <Buffer b1 ba 84 6b 23 8f bd 4e 2f c2 77 b1 13 6c a8 61>
    [0xb1,0xba,0x84,0x6b,0x23,0x8f,0xbd,0x4e,0x2f,0xc2,0x77,0xb1,0x13,0x6c,0xa8,0x61]
encryptedData (ie encrypted data from lastpass, c'est la target...)
    <Buffer 8e e8 7e 20 8b 8f 74 a7 63 6f 5d 43 df 4e 87>
    [0x8e,0xe8,0x7e,0x20,0x8b,0x8f,0x74,0xa7,0x63,0x6f,0x5d,0x43,0xdf,0x4e,0x87]
    dans python ça diffère au début :
    db:8e:e8:7e:20:8b:8f:74:a7:63:6f:5d:43:df:4e:87
decrypted data vu dans python
    6e:6f:74:65:20:74:65:73:74:07:07:07:07:07:07:07

###
data = Buffer.from('note test', 'utf8')

encrypted = encrypt(data)
decrypted = decrypt(encrypted)

console.log '\ncas 2: data="'+ data + '"', data
console.log '\nencrypted    :', encrypted
console.log 'enctyp target: <Buffer    8e e8 7e 20 8b 8f 74 a7 63 6f 5d 43 df 4e 87>'
bufTarget1 = Buffer.from([0x8e,0xe8,0x7e,0x20,0x8b,0x8f,0x74,0xa7,0x63,0x6f,0x5d,0x43,0xdf,0x4e,0x87])
console.log 'or           : <Buffer db 8e e8 7e 20 8b 8f 74 a7 63 6f 5d 43 df 4e 87>'
bufTarget2 = Buffer.from([0xdb,0x8e,0xe8,0x7e,0x20,0x8b,0x8f,0x74,0xa7,0x63,0x6f,0x5d,0x43,0xdf,0x4e,0x87])

console.log ''
console.log 'is encrypted égale à target1', encrypted.compare(bufTarget1) == 0
console.log 'is encrypted égale à target2', encrypted.compare(bufTarget2) == 0

console.log '\ndecrypted', decrypted
console.log 'decrypted.toString', decrypted.toString('utf8')
console.log 'decrypted partiel', decrypt(encrypted.slice(0,16))
