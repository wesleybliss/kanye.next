import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import whitelist from '../../lib/whitelist'
import { getRandomQuote } from '../../lib/db'

const corsOptions = {
    
    methods: ['GET', 'OPTIONS'],
    
    origin: (origin, callback) => {
        
        // Optionally restrict origins here
        origin && console.log('CORS', origin)
        
        // @todo not sure why this is undefined sometimes with GET requests
        if (typeof origin === 'undefined')
            return callback(null, true)
        
        if (whitelist.some(it => it.test(origin)))
            callback(null, true)
        else
            console.log('origin', origin, 'did not match\n', whitelist.join('\n')) || callback(new Error('Unauthorized'))
        
    }
    
}

const cors = initMiddleware(
    Cors(corsOptions)
)

const handler = async (req, res) => {
    
    await cors(req, res)
    
    try {
        
        const quote = await getRandomQuote()
        
        res.status(200).json(quote)
        
    } catch (e) {
        
        console.error('api/yeet', e)
        
        return res.status(500).json({ error: 'An unexpected error ocurred' })
        
    }
    
}

export default handler
