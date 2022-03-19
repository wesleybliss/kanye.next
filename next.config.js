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

env.PROJECT_ROOT = __dirname

// Don't pre-configure database directory for
// CI environments, as they're often ephemeral
if (!process.env.IS_CI && env.DB_DIR) {
    env.DB_DIR = path.join(__dirname, env.DB_DIR)
    if (!fs.existsSync(env.DB_DIR))
        fs.mkdirSync(env.DB_DIR)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env,
}

module.exports = nextConfig
