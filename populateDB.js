var mongo = require('mongodb').MongoClient
var moment = require('moment')
var fetch = require('node-fetch')
var failedDates = []

var start = moment.now()
var url = 'mongodb://localhost:27017/lotto'
var counter = 0

mongo.connect(url, function (err, db) {
    if (err) throw err
    var firstName = process.argv[2]
    var lastName = process.argv[3]
    var drawings = db.collection('drawings')
    
    var date
    
    drawings.find().sort({date: -1}).limit(1)
    .toArray(function (err, result) {
        if (result && result.length > 0) {
            date = result[0].date
        } else {
            date = '1986-04-19'
        }
        date = new moment(date)
        date.add(1, 'week')
        run(date, drawings, db)
    })

})

function run (date, drawings, db) {
    fetchResults(date)
    .then(function (result) {
        drawings.insertOne({
            result: result
            , date: date.format('Y-MM-DD')
        }, function (err, data) {
            if (err) {
                throw err
            }
            counter--
            console.log('inserted 1 record. date is now ' + date.format('MM.DD.Y'))
            return result
        })
        return result
    })
    .then(function (result) {
        date.add(1, 'week')
        if (date.isAfter((new moment(moment.now())))) {
            var checkForDone = setInterval(function () {
                if (counter === 0) {
                    db.close()
                    clearInterval(checkForDone)
                    console.log('----------------------------------------------------------------')
                    console.log('done! finished in ' + ((moment.now() - start) / 1000) + ' seconds')
                    console.log('failed dates:')
                    console.log(failedDates)
                    return
                }
            }, 150)
        } else {
            setTimeout(function () {
                run(date, drawings, db)
            }, 500)
        }
    })
}

function fetchResults (date) {
    counter++
    return fetch(formatURL(date))
        .then(function (response) {
            return response.text()
        })
        .then(function (text) {
            return text.split('/*').join('').split('*/').join('').split('while(true); -1;').join('').split('while(true); 0;').join('').split('\n').join('')
        })
        .then(function (text) {
            return JSON.parse(text)
        })
        .then(function (json) {
            if (json.errorNo) {
                throw new Error(json.userMsg)
            }
            return json
        })
        .then(function (json) {
            return json.dataTable.filter(function (drawing) {
                return drawing.primaryNumberTimes > 0
            })
        })
        .then(function (drawings) {
            return drawings.map(function (drawing) {
                return drawing.number
            })
        })
        .catch(function (err) {
            failedDates.push(date.format('MM.DD.Y'))
            console.log(err)
        })
}

function formatURL (date) {
    var date = date.format('DD.MM.Y')
    
    var url = 'https://www.norsk-tipping.no/miscellaneous/getNumberStatistics.json?toDate=' +
        date +
        '&fromDate=' +
        date +
        '&gameID=1'
    return url
}

