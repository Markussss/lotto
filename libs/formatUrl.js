exports.formatUrl = function (toDate, fromDate) {
  var toDate = toDate.format('DD.MM.Y')
  var fromDate = fromDate.format('DD.MM.Y')
  
  var url = 'https://www.norsk-tipping.no/miscellaneous/getNumberStatistics.json?toDate=' +
    toDate +
    '&fromDate=' +
    fromDate +
    '&gameID=1'
  return url
}
