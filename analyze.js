var mongo = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/lotto'

mongo.connect(url, function (err, db) {
    if (err) throw err
    var drawings = db.collection('drawings')
    var date
    drawings.find().sort({date: -1}).limit(1)
    .toArray(function (err, result) {
        if (result[0]) {
            date = result[0].date
            console.log(date)
        } else {
            console.log('no result')
        }
        db.close()
    })
    // drawings.find()
    // .toArray(function (err, documents) {
    //     if (err) throw err
    //     return new Promise (function (resolve, reject) {
    //         return resolve(documents)
    //     })
    //     .then(function (docs) {
    //         return docs.map(function (doc) {
    //             return doc.result
    //         })
    //         .reduce(function (resultCount, result) {
    //             if (result) {
    //                 result.forEach(function (number) {
    //                     if (resultCount.hasOwnProperty(number)) {
    //                         resultCount[number] += 1
    //                     } else {
    //                         resultCount[number] = 1
    //                     }
    //                 })
    //             }
    //             return resultCount
    //         }, {})
    //     })
    //     .then(function (results) {
    //         console.log(results)
    //         return results
    //     })
    //     .then(function () {
    //         db.close()
    //     })
    // })
})