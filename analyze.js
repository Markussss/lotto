var mongo = require('mongodb').MongoClient
var moment = require('moment')
var url = 'mongodb://localhost:27017/lotto'
var fetchResults = require('./libs/fetchResults.js').fetchResults

mongo.connect(url, function (err, db) {
  if (err) throw err
  var drawings = db.collection('drawings')
  var date
  drawings.find().sort({date: 1})
  .toArray(function (err, result) {
    if (err) throw err
    var maxDate = new moment(result[0].date)
    var minDate = new moment(result[result.length - 1].date)

    var dbResult = result.reduce(function (car, cur) {
      console.log(cur)
      if (cur.result) {
        cur.result.forEach(function (number) {
          if (car.hasOwnProperty(number)) car[number] += 1
          else car[number] = 1
        }) 
      }
      return car
    })
    
    fetchResults(minDate, maxDate, 2)
    .then(function (results) {
      // console.log(results)
      console.log(dbResult)
    })
    db.close()
  })
  // drawings.find()
  // .toArray(function (err, documents) {
  //   if (err) throw err
  //   return new Promise (function (resolve, reject) {
  //     return resolve(documents)
  //   })
  //   .then(function (docs) {
  //     return docs.map(function (doc) {
  //       return doc.result
  //     })
  //     .reduce(function (resultCount, result) {
  //       if (result) {
  //         result.forEach(function (number) {
  //           if (resultCount.hasOwnProperty(number)) {
  //             resultCount[number] += 1
  //           } else {
  //             resultCount[number] = 1
  //           }
  //         })
  //       }
  //       return resultCount
  //     }, {})
  //   })
  //   .then(function (results) {
  //     console.log(results)
  //     return results
  //   })
  //   .then(function () {
  //     db.close()
  //   })
  // })
})