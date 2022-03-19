import Cors from 'cors'
import { isValidAdminToken } from '../../lib/utils'
import initMiddleware from '../../lib/init-middleware'
import { initialize } from '../../lib/db'

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'OPTIONS'],
    })
)

const handler = async (req, res) => {
    
    await cors(req, res)
    
    try {
        
        if (!isValidAdminToken(req))
            return res.status(401).json({ error: 'Unauthorized' })
        
        await initialize()
        res.status(200).json({ init: 'ok' })
        
    } catch (e) {
        
        console.error('api/init', e)
        
        return res.status(500).json({ error: 'An unexpected error ocurred' })
        
    }
    
}

export default handler
