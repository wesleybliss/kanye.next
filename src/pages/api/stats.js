import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import { getStats } from '../../lib/db'

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'OPTIONS'],
    })
)

const handler = async (req, res) => {
    
    await cors(req, res)
    
    try {
        
        res.status(200).json(getStats())
        
    } catch (e) {
        
        console.error('api/stats', e)
        
        return res.status(500).json({ error: 'An unexpected error ocurred' })
        
    }
    
}

export default handler
