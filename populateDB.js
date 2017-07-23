var mongo = require('mongodb').MongoClient
var moment = require('moment')
var fetchResults = require('./libs/fetchResults.js').fetchResults

var failedDates = []
var counter = 0

var start = moment.now()
var url = 'mongodb://localhost:27017/lotto'

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
  counter++
  fetchResults(date, date)
  .then(function (result) {
    counter--
    drawings.insertOne({
      result: result
      , date: date.format('Y-MM-DD')
    }, function (err, data) {
      if (err) {
        throw err
      }
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
  .catch(function (err) {
    console.log(err)
    failedDates.push(date)
  })
}
