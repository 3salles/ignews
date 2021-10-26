import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <h1>ig.news</h1>
      <div className={styles.headerContent}>
        <img src="/images/logo.png" alt="Logo do ig.news" />
      <nav>
        <a className={styles.active} href="#">Home</a>
        <a href="#">Posts</a>
      </nav>
      </div>
    </header>
  )
}