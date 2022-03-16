import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home = () => {
    
    return (
        
        <div className={styles.Home}>
            
            <Head>
                <title>kanye.next</title>
                <meta name="description" content="_" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <main className={styles.main}>
                
                <h5 className={styles.title}>
                    kanye.next
                </h5>
                
            </main>
            
        </div>
        
    )
    
}

export default Home
