import Cors from 'cors'
import { isValidAdminToken } from '../../lib/utils'
import initMiddleware from '../../lib/init-middleware'
import { resetAll } from '../../lib/db'

const cors = initMiddleware(
    Cors({
        methods: ['POST', 'OPTIONS'],
    })
)

const handler = async (req, res) => {
    
    await cors(req, res)
    
    try {
        
        if (!isValidAdminToken(req))
            return res.status(401).json({ error: 'Unauthorized' })
        
        await resetAll()
        res.status(200).json({ reset: 'ok' })
        
    } catch (e) {
        
        console.error('api/reset', e)
        
        return res.status(500).json({ error: 'An unexpected error ocurred' })
        
    }
    
}

export default handler
