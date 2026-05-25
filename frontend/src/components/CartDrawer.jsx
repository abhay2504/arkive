import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { cart, cartTotal, isOpen, setIsOpen, updateQty, removeItem, fetchCart } = useCart()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>Your Cart</span>
          <button className={styles.close} onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className={styles.body}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty</p>
              <small>Add something beautiful.</small>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className={styles.item}>
                <div className={styles.itemThumb}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="4" width="20" height="24" rx="2" fill="#D8D4CE"/>
                  </svg>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.productName}</div>
                  <div className={styles.itemMeta}>{item.color} · Size {item.size}</div>
                  <div className={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                  <div className={styles.itemActions}>
                    <div className={styles.qtyControl}>
                      <button onClick={() => item.qty > 1 ? updateQty(item._id, item.qty - 1) : removeItem(item._id)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item._id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.row} style={{ color: 'var(--muted)' }}>
              <span>Shipping</span><span>Free</span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button className={styles.checkoutBtn}>Proceed to Checkout →</button>
          </div>
        )}
      </aside>
    </>
  )
}
