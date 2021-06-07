// io
const daggy = require('daggy')


const IO = daggy.tagged('IO', ['f'])

IO.prototype.unsafePerformIO = function() {
    return this.f()
}

IO.prototype.map = function(f) {
    return IO(()=> f(this.unsafePerformIO()))
}

IO.prototype.chain = function(f) {
    
    return f(this.unsafePerformIO())
}

module.exports = {IO}