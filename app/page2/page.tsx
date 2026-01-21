'use Client'
import styles from './style.module.css';
import Link from 'next/link';

export default function page_two(){
    return(
        <main>
            <h1 className={styles.titulo}>PAGINA two</h1>
            <Link rel="stylesheet" href="/"> PAGINA UNO</Link> 
        </main>
    )
}