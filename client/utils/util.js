const formatTime = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
    unique: function (arr) {
        const seen = new Map()
        return arr.filter((a) => !seen.has(a.topic_id) && seen.set(a.topic_id, 1))
    },
    uniqueComment: function (comments) {
        const seen = new Map()
        return comments.filter((reply) => !seen.has(reply.reply_id) && seen.set(reply.reply_id, 1))
    },
    printHello: function () {
        console.log('Hello Tanc')
    },
    formatTime: formatTime
}
