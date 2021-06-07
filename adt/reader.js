// reader
const daggy = require('daggy')
const { compose } = require('./../utils')

//  Reader e a
const Reader = daggy.tagged('Reader', ['f'])

Reader.prototype.map = function(f) {
    return Reader(compose(f, this.f))
}

Reader.of = function(x) {
  return Reader(() => x)
}

Reader.prototype.runWith = function(x) {
    return this.f(x)
}

//Reader e a ~> (a -> Reader e b) -> Reader e b
Reader.prototype.chain = function(fn) {
    var self = this
    return Reader( config => fn(self.runWith(config)).runWith(config))
}

// Reader.ask :: (e -> b) -> Reader e b
Reader.ask = function(f) {
    const g = f ? f: x => x
    return Reader(g)
}

module.exports = { Reader }