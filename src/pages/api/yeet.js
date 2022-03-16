import quotes from '../../quotes.json'

export default function handler(req, res) {
    
    try {
        
        const quote = quotes[Math.floor(Math.random() * quotes.length)]
        const json = JSON.stringify({ quote: quote })
        
        res.status(200).json(json)
        
    } catch (e) {
        
        console.error('api/yeet', e)
        
        return res.status(500).json({ error: 'An unexpected error ocurred' })
        
    }
    
}
