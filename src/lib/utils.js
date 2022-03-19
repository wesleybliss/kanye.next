
const parseBearerToken = req => {
    
    try {
        
        const token = req.headers.authorization
            .split('Bearer')
            .pop()
            .trim()
        
        if (!token?.length)
            throw new Error('Failed to parse auth header')
        
        return token
        
    } catch (e) {
        
        console.log('parseBearerToken headers', req.headers)
        console.warn('parseBearerToken', e)
        
        return null
        
    }
    
}

export const isValidAdminToken = req => {
    
    if (!process.env.ADMIN_TOKEN)
        throw new Error('A_T_NOT_SET')
    
    return parseBearerToken(req) === process.env.ADMIN_TOKEN
    
}

export const randomInt = (from, to) =>
    Math.floor(Math.random() * (to - from + 1) + from)
