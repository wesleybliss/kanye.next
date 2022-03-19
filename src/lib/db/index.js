import * as fs from 'fs'
import * as path from 'path'
import * as utils from '../utils'
import sqlite from 'better-sqlite3'
import quotes from '../../quotes.json'

const schema = `
CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT UNIQUE NOT NULL,
    used INT NOT NULL default 0
);
`

const root = process.env.IS_CI
    ? path.join(process.env.DB_DIR, '../', process.env.DB_DIR)
    : process.env.DB_DIR

if (!fs.existsSync(root)) {
    console.info('Creating database directory at', root)
    fs.mkdirSync(root)
}

export const file = path.join(root, 'quotes.db')
console.info('Creating database file at', file)
export const db = sqlite(file)

console.info('Creating database schema')
db.exec(schema)

const { count } = db.prepare('SELECT COUNT(*) AS `count` FROM quotes').get()

// Seed the database, if needed
if (count === 0) {
    console.log('Seeding the database with', quotes.length, 'quotes')
    const insert = db.prepare('INSERT INTO quotes (quote, used) VALUES (@quote, @used)')
    const insertMany = db.transaction(quotes => {
        for (const quote of quotes) insert.run(quote)
    })
    insertMany(quotes.map(it => ({ quote: it, used: 0 })))
}

// console.log(db.prepare('SELECT * from quotes limit 5').all())

const getCountFor = used => {
    const { count } = db.prepare(`SELECT COUNT(*) AS 'count' FROM quotes WHERE used = ${used}`).get()
    return count
}

export const getRandomQuote = () => {
    const { count } = db.prepare('SELECT COUNT(*) AS `count` FROM quotes WHERE used = 0').get()
    const offset = utils.randomInt(0, count - 1)
    return db.prepare(`
        UPDATE quotes
            SET used = 1
            RETURNING *
            LIMIT 1 OFFSET ${offset}
    `).get()
}

export const getStats = () => {
    return {
        used: getCountFor(1),
        available: getCountFor(0),
    }
}

export default db
