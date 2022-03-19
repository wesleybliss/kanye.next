const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const loadEnvironment = () => {
    
    const env = path.resolve(__dirname, '.env')
    const sampleEnv = path.resolve(__dirname, 'sample.env')
    
    if (process.env.IS_CI) {
        const { parsed } = dotenv.config({ path: sampleEnv })
        return Object.keys(parsed).reduce((acc, it) => ({
            ...acc,
            [it]: process.env[it],
        }), {})
    }
    
    if (!fs.existsSync(env))
        throw new Error('Could not find .env file')
    
    const { parsed } = dotenv.config({ path: env })
    
    // console.info('Loading env vars from system', parsed)
    
    return parsed
    
}

const env = loadEnvironment()

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env,
}

module.exports = nextConfig
