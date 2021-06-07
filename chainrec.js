// fr
const daggy = require('daggy')
const { map, toUpper, chain } = require('ramda')
const { Reader } = require('./adt/reader')

const compose = (...fns) => x => fns.reduceRight((acc, f)=> f(acc), x)
const I = x => x
const kCompose = (f, g) => x => f(x).chain(g)

const Free = daggy.taggedSum('Free', {Impure: ['x', 'f'], Pure: ['x']})
const {Impure, Pure} = Free

Free.prototype.chain = function(g) {
    return this.cata({
        Impure: (x, f) => Impure(x, kCompose(f, g)),
        Pure: x => g(x)
    })
}

Free.prototype.map = function(g) {
    return this.chain(a => Pure(g(a)))
}

const liftF = command => Impure(command, Pure)

const Maybe = daggy.taggedSum('Maybe', {
    Just: ['x'],
    Nothing: []
})

const { Just, Nothing } = Maybe

const IO = daggy.tagged('IO', ['f'])
IO.prototype.unsafePerformIO = function() {
    return this.f()
}

const Either = daggy.taggedSum('Either', {
    Left: ['x'],
    Right: ['x']
})

const just = compose(liftF, Just)
const nothing = liftF(Nothing)
const io = compose(liftF, IO)

const runMaybe = free =>
  free.cata({
    Pure: x => x,
    Impure: (m, q) =>
      m.cata({
        Just: x => runMaybe(q(x)),
        Nothing: () => Nothing
      })
  })

const unsafePerformIO = free => 
  free.cata({
      Pure: x => x,
      Impure: (m, q)=> unsafePerformIO(q ( m.f() ) )
  })

const safeProp = k => o => o[k] ? just(o[k]) : nothing
const isNothing = x => Boolean(x.is)
// valueOrDefault :: a -> Maybe -> a Just
const valueOrDefault = def => x => isNothing(x) ? def : x

// path :: String -> {} -> Maybe
const safePath = x => o => {
    const [head, ...tail ] = x.split('.')
    return tail.reduce((acc, c) =>  acc.chain(m => safeProp(c)(m)), safeProp(head)(o))
}

const printLn = x => io(() => console.log(x))
const maybeToIO = x => io(()=> x)
const maybetoReader = x => Reader.of(x)


const stdout = compose(
  unsafePerformIO,
  chain(printLn),
  maybeToIO,
)


const proc = compose(
    //stdout,
    // printLn,
    maybetoReader,
    valueOrDefault('something where wrong'),
    runMaybe,
    map(toUpper),
    map(x => x + ' alvato '),
    safePath('name.mm')
)

const y = proc({name: { mm: 'platano'}})
console.log(y.runWith('zapa'))

// const t = io(()=> proc({name: {a: 'jerry', mm: 'hola'}}))
//     .chain(printLn)
// unsafePerformIO(t)
// console.log(tt, unsafePerformIO(tt))ç
// unsafePerformIO(tt)