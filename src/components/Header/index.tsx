import { SignInButton } from '../SignInButton'
import Image from 'next/image'
import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLInk'

export function Header(){

  
  return(
    <header className={styles.headContainer}>
      <div  className={styles.headContent}>
        <img src="/images/logo.svg" alt="logo"/>
        {/* <Image src="/images/logo.svg" alt="ig.news" width="100%" height="100%" layout="responsive" objectFit="contain"/> */}
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton/>
      </div>
    </header>
  )
}