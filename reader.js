// reader

const { Monad } = require('./utils')
const { toUpper, converge, compose, concat, flip } = require('ramda')
const { Reader } = require('./adt/reader')
const process = require('process');
const {ask} = Reader

// greet :: String -> String -> Reader String String
const greet = greeting => str => `${greeting} ${str}` 

// addFarewell :: String -> Reader String String
const addFarewell = farewell => str =>
  ask(env => `${str}${farewell} ${env}`)


const a = Reader(greet('hola'))
  .map(toUpper)
  .chain(addFarewell(' alo que '))
  .runWith('Maria')

const getFullYear = d => d.getFullYear()
const getMonth = d => d.getMonth()
const getDay = d => d.getDate()
const addZeroToDate = x => x < 10 ? `0${x}` : x
const toNumber = x => Number(x)
const formatDate = converge((d, m, y)=> `${d}-${m}-${y}`, [
  compose(addZeroToDate, toNumber, getDay), 
  compose(addZeroToDate ,toNumber, getMonth), 
  getFullYear
])

const addDate = x => `(${new Date()}) ${x}`
const wrapWith = l => r => str => `${l}${str}${r}`


const logger = Reader.of(new Date())
  .map(formatDate)
  .map(wrapWith('(')(')'))
  .map(flip(concat)(': '))
  
  // .chain(x => Reader(concat(process.id)))
  .chain(x => Reader(concat(x)))
  .map(concat(' <> '))
  .map(concat(`[${process.pid}]`))
  .runWith('jo que error')
console.log(logger)