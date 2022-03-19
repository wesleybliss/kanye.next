import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import quotes from '../../quotes.json'

const client = new MongoClient(process.env.MONGO_URI)

/**
 * Connects to MongoDB
 * 
 * @returns {Object} result
 * @returns {Database} result.db
 * @returns {Collection} result.col
 */
export const connect = async () => {
    
    await client.connect()
    
    const db = client.db(process.env.MONGO_DB)
    const col = db.collection('quotes')
    
    return { db, col }
    
}

/**
 * Wrapper for easily connecting to MongoDB,
 * executing a query, and closing the connection when finished
 * 
 * @param {Function} fn Callback to execute a query using the connected database/collection
 */
export const withConnect = fn => async () => {
    
    try {
        const { db, col } = await connect()
        return await fn(col, db)
    } catch (e) {
        client.close()
        throw e
    }
    
}

/**
 * (INTERNAL) Initializes the database, seeding the
 * quotes column with data if it's empty
 */
export const initialize = withConnect(async (col) => {
    
    try {
        
        const count = await col.count()
        
        if (count !== 0) {
            // No need to seed
            return // console.info('Database already populated (count:', count + ')')
        }
        
        await col.insertMany(
            quotes.map(quote => ({ quote, used: false })),
        )
        
        console.log('Seeded database with', quotes.length, 'quotes')
        
    } catch (e) {
        
        console.error(e.description || e)
        
    }
    
})

/**
 * Gets quotes stats (used & available counts)
 * 
 * @returns {Object} result
 * @returns {Number} result.used Used count
 * @returns {Number} result.available Available count
 */
export const getStats = withConnect(async (col) => {
    
    const res = await col.aggregate([
        {
            $facet: {
                used: [
                    { $match: { used: true } },
                    { $count: 'used' },
                ],
                available: [
                    { $match: { used: false } },
                    { $count: 'available' },
                ],
            },
        },
        {
            $project: {
                used: { $arrayElemAt: ['$used.used', 0] },
                available: { $arrayElemAt: ['$available.available', 0] }
            }
        },
    ])
    
    const values = await res.toArray()
    const { used, available } = values
    
    // Aggregate cursor omits empty results, so provide defaults
    return {
        used: used || 0,
        available: available || 0,
    }
    
})

/**
 * Gets a random quote from the database
 * and simultaneously marks it as used
 * 
 * @returns {Object} result
 * @returns {String} result.quote Quote text
 */
export const getRandomQuote = withConnect(async (col) => {
    
    const usedId = uuidv4()
    
    const upsert = await col.aggregate([
        { $match: { used: false } },
        { $sample: { size: 1 } },
        { $set: { used: true } },
        { $set: { usedId } },
        { $merge: 'quotes' },
    ])
    
    // Required to commit changes from the aggregation
    await upsert.next()
    
    const query = { usedId }
    const options = { projection: { _id: 0, quote: 1 } }
    
    return await col.findOne(query, options)
    
})

/**
 * (INTERNAL) Resets all quotes in the database to unused
 */
export const resetAll = withConnect(async (col) => {
    
    const filter = { used: true }
    const fields = {
        $set: {
            used: false,
        }
    }
    
    await col.updateMany(filter, fields)
    
})
