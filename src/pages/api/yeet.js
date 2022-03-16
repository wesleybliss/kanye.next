import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import quotes from '../../quotes.json'

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'OPTIONS'],
    })
)

const handler = async (req, res) => {
    
    await cors(req, res)
    
    try {
        
        const quote = quotes[Math.floor(Math.random() * quotes.length)]
        const json = JSON.stringify({ quote: quote })
        
        res.status(200).json(json)
        
    } catch (e) {
        
        console.error('api/yeet', e)
        
        return res.status(500).json({ error: 'An unexpected error ocurred' })
        
    }
    
}

export default handler
