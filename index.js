const Free = require('@safareli/free')
const daggy = require('daggy')
const { Loop, Done } = daggy.taggedSum("Loop", {
    Loop: ["b"],
    Done: ["a"]
  });
console.log(Free)
const a = Free.of(12)
console.log(a.map(z => z +1), Loop(9))