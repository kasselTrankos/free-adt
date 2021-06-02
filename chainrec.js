// fr
const daggy = require('daggy')
const { map, toUpper } = require('ramda')

const compose = (...fns) => x => fns.reduceRight((acc, f)=> f(acc), x)
const I = x => x
const kCompose = (f, g) => x => f(x).chain(g)

const Free = daggy.taggedSum('Free', {Suspend: ['x', 'f'], Pure: ['x']})
const {Suspend, Pure} = Free

Free.prototype.chain = function(g) {
    return this.cata({
        Suspend: (x, f) => Suspend(x, kCompose(f, g)),
        Pure: x => g(x)
    })
}

Free.prototype.map = function(g) {
    return this.chain(a => Pure(g(a)))
}

const liftF = command => Suspend(command, Pure)

const Maybe = daggy.taggedSum('Maybe', {
    Just: ['x'],
    Nothing: []
})

const { Just, Nothing } = Maybe

const Either = daggy.taggedSum('Either', {
    Left: ['x'],
    Right: ['x']
})

const just = compose(liftF, Just)
const nothing = liftF(Nothing)

const runMaybe = free =>
  free.cata({
    Pure: x => x,
    Suspend: (m, q) =>
      m.cata({
        Just: x => runMaybe(q(x)),
        Nothing: () => Nothing
      })
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


const proc = compose(
    valueOrDefault('something where wrong'),
    runMaybe,
    map(toUpper),
    safePath('name.a.90')
)
console.log(proc({name: {a: 'jerry'}}))