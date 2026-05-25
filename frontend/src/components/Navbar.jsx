import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { cartCount, setIsOpen } = useCart()

  const showToast = (section) => {
    const toast = document.createElement('div')
    toast.textContent = `${section} — Coming Soon`
    toast.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%;
      transform: translateX(-50%);
      background: #1A1814; color: #F7F4EF;
      padding: 0.75rem 1.5rem; border-radius: 3px;
      font-size: 0.82rem; letter-spacing: 0.05em;
      z-index: 9999; font-family: 'DM Sans', sans-serif;
      animation: fadeIn 0.3s ease;
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>ARKIVE</div>
      <div className={styles.right}>
        <a className={styles.link} onClick={() => showToast('New In')}>New In</a>
        <a className={styles.link} onClick={() => showToast('Collections')}>Collections</a>
        <a className={styles.link} onClick={() => showToast('About')}>About</a>
        <button className={styles.cartBtn} onClick={() => setIsOpen(true)}>
          Cart <span className={styles.count}>{cartCount}</span>
        </button>
      </div>
    </nav>
  )
}