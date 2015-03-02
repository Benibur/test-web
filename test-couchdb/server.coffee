nano   = require('nano')('http://localhost:5984')
Chance = require('chance')
Chance = new Chance()

# parameters of the test
MODE_TEST = 'init'  # 'query'
MODE_TEST = 'insertTenPhoto' # 'init'
MODE_TEST = 'query' # 'init'
NUM_PHOTO = 1000000
MIN_YEAR  = 2000
MAX_YEAR  = 2010
LOG_VIEW  = true


test =

    main: ()->
        if MODE_TEST == 'init'
            console.log "MODE #{MODE_TEST} avec création de #{NUM_PHOTO} photos"
            @initDB(test.queryView)
        else if MODE_TEST == 'query'
            console.log "MODE #{MODE_TEST}"
            @getDB test.queryView
        else if MODE_TEST == 'insertTenPhoto'
            console.log "MODE #{MODE_TEST}"
            @getDB () ->
                test.addPhoto(10)


    initDB: (cb) ->
        @getEmptyDB ()=>
            # @addPhoto(NUM_PHOTO, @next)
            @addPhotoBulk NUM_PHOTO, () =>
                test.createViewOnPhoto cb


    createViewOnPhoto : (cb) ->
        design_doc =
            views:
                byYMD:
                    map: (doc) ->
                        d = new Date(doc.date)
                        emit([d.getFullYear(),d.getMonth()+1,d.getDate()], doc._id)
                    reduce: '_count'
        test.db.insert  design_doc  ,
                    '_design/photo' ,
                    (err, body) ->
                        if err
                            console.log err
                            return
                        cb()


    queryView: () ->
        startTime = Date.now()
        test.db.view 'photo', 'byYMD',
                 group       : true,
                 group_level : 2 ,
                 reduce      : true
                ,
                (err, body) ->
                    if err
                        console.log err
                        return
                    endTime = Date.now()
                    duration = endTime - startTime
                    if LOG_VIEW
                        body.rows.forEach (doc)->
                            console.log(doc.key + '  -  ' + doc.value)
                    console.log "durée de récupération view : #{duration/1000}s"


    getDB: (cb) ->
        test.db = nano.db.use('alice')
        cb()


    getEmptyDB: (cb)->
        nano.db.get 'alice', (err, body)->
            if !err
                nano.db.destroy 'alice', (err, body)->
                    nano.db.create 'alice', (err, body)->
                        test.db = nano.db.use('alice')
                        cb()
            else
                nano.db.create 'alice', (err, body)->
                    test.db = nano.db.use('alice')
                    cb()


    addPhoto: (n, cb) ->
        nPhotoStored     = 0
        testEnd = ()->
            nPhotoStored  +=1
            if nPhotoStored == n
                endTime = Date.now()
                duration = endTime - startTime
                console.log "durée création #{n} photo : #{duration/1000}s"
                cb() if cb
        startTime = Date.now()
        years = Chance.n(Chance.year, n, min: MIN_YEAR, max: MAX_YEAR)
        for y in years
            d = Chance.date( year: y)
            @db.insert
                date    : d
                titre   : 'une jolie photo'
                fichier : 'photo.jpeg'
                ,
                ()->
                    testEnd()


    addPhotoBulk: (n, cb) ->
        years = Chance.n(Chance.year, n, min: MIN_YEAR, max: MAX_YEAR)
        photos = []
        for y in years
            d = Chance.date( year: y)
            photos.push
                date    : d
                titre   : 'une jolie photo'
                fichier : 'photo.jpeg'
        startTime = Date.now()
        @db.bulk docs:photos, (err, body)->
            if err
                console.log err
                return
            endTime = Date.now()
            duration = endTime - startTime
            console.log "durée création #{n} photo en bulk :
                         #{duration/1000}s"
            cb()


test.main()


