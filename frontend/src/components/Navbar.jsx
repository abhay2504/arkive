import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { cartCount, setIsOpen } = useCart()

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>ARKIVE</div>
      <div className={styles.right}>
        <a className={styles.link}>New In</a>
        <a className={styles.link}>Collections</a>
        <a className={styles.link}>About</a>
        <button className={styles.cartBtn} onClick={() => setIsOpen(true)}>
          Cart <span className={styles.count}>{cartCount}</span>
        </button>
      </div>
    </nav>
  )
}
