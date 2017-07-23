var fetch = require('node-fetch')
var formatUrl = require('./formatUrl.js').formatUrl

exports.fetchResults = function (startDate, endDate, type) {
  if (!type) type = 1
  return fetch(formatUrl(startDate, endDate))
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
      if (type === 2) return json.dataTable
      return json.dataTable.filter(function (drawing) {
        return drawing.primaryNumberTimes > 0
      })
    })
    .then(function (drawings) {
      if (type === 2) return drawings.reduce(function (car, cur) {
        car[cur.number] = cur.primaryNumberTimes
        return car
      }, {})
      return drawings.map(function (drawing) {
        return drawing.number
      })
    })
    .catch(function (err) {
      console.log(err)
      return
    })
}
