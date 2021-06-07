// reader

const { Monad } = require('./utils')
const { toUpper, converge, compose, concat, flip, map, chain } = require('ramda')
const { Reader } = require('./adt/reader')
const { IO } = require('./adt/io')
const process = require('process');
const {ask} = Reader

// greet :: String -> String -> Reader String String
const greet = greeting => str => `${greeting} ${str}` 

// addFarewell :: String -> Reader String String
const addFarewell = farewell => str =>
  ask(env => `${str}${farewell} ${env}`)


const a = hi => y =>() => Reader(greet(hi))
  .map(toUpper)
  .chain(addFarewell(y))
  // .runWith('Maria')

const getFullYear = d => d.getFullYear()
const getMonth = d => d.getMonth()
const getDay = d => d.getDate()
const getHours = d => d.getHours()
const getMinutes = d => d.getMinutes()
const getSeconds = d => d.getSeconds()
const addZeroToDate = x => x < 10 ? `0${x}` : x
const toNumber = x => Number(x)
const formatDate = f => converge(f, [
  compose(addZeroToDate, toNumber, getDay), 
  compose(addZeroToDate ,toNumber, getMonth), 
  getFullYear,
  compose(addZeroToDate, toNumber, getHours),
  compose(addZeroToDate, toNumber, getMinutes),
  compose(addZeroToDate, toNumber, getSeconds),
])

const wrapWith = l => r => str => `${l}${str}${r}`
const pid = IO(() => process.pid)
  .map(wrapWith('[')(']'))

const ioToReader = x => Reader.of(x.unsafePerformIO())
const readerToIO = x => y => IO(() => y.runWith(x))
const printLn = x => IO(() => console.log(x))

const dateLogger = IO(() => new Date())
  .map(formatDate((d, m, y, h, mm, s)=> `${d}-${m}-${y} ${h}:${mm}:${s}`))

const logger = () => ioToReader(dateLogger)
  .map(wrapWith('(')(')'))
  .map(flip(concat)(': '))
  .chain(x => Reader(concat(x)))
  .map(concat('-'))
  .chain(x => ioToReader( 
    pid.map(
      flip(concat)(x))
    )
  )


const proc = x => reader => compose(
  x => x.unsafePerformIO(),
  chain(printLn),
  readerToIO(x),
  reader,
)(x)

proc('my logger cleaner')(logger)
proc('pepa')(a('HIRE ')(' dime que '))