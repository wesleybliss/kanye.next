
// @todo This is a very inefficient way to manage this list

export default [
    'http://localhost(.*)',
    'http://127.0.0.1(.*)',
    'https://([a-z0-9]+[.])*wesleybliss[.]com',
    // https://kanye-says-9ouz8eb0i-wesleybliss.vercel.app
    'https://(.*)[-]wesleybliss[.]vercel[.]app',
    'http://kanye-says.local(.*)',
    'https://kanye-says[.]vercel[.]app',
].map(it => new RegExp(it))
