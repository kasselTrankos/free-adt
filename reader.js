// reader
const daggy = require('daggy')
const compose = (f, g) => x => f(g(x))

//  Reader e a
const Reader = daggy.tagged('Reader', ['f'])

Reader.prototype.map = function(f) {
    return Reader(compose(this.f, f))
}

Reader.prototype.runWith = function(x) {
    return this.f(x)
}

Reader.prototype.chain = function(that) {
    return compose(this.f, that.f)
}

// Reader.ask :: (e -> b) -> Reader e b
Reader.ask = function(f) {
    const g = f ? f: x =>x
    return Reader(g)
}
const add =
  x => y => x + y

const a = Reader.ask(add(10)).runWith(56)

const greet = greeting =>
  Reader(name => `${greeting}, ${name}`)

const addFarewell = farewell => str =>
  Reader.ask(env => `${str}${farewell} ${env}`)
const concat = x => y => `${x}${y}`
const flow =
  greet('Hola')
  .map(concat('...'))
  .chain(addFarewell('See Ya'))
const b =flow
    .runWith('Jenny')

console.log(b)
// const f = x => x * 3
// const g = x => x + 2 

// console.log(compose(f, g)(2))

// const greeet = Reader(name => `${greeting}, ${name}`)



