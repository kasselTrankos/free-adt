// io
const daggy = require('daggy')


const IO = daggy.tagged('IO', ['f'])

IO.prototype.unsafePerformIO = function() {
    return this.f()
}

IO.prototype.map = function(f) {
    return IO(()=> f(this.unsafePerformIO()))
}

module.exports = {IO}