import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import styles from './ProductPage.module.css'

const API = import.meta.env.VITE_API_URL || '/api'

// Fallback product data if API isn't seeded yet
const FALLBACK_PRODUCT = {
  _id: 'local',
  name: 'Structured Wool Overcoat',
  subtitle: 'Premium outerwear',
  price: 8499,
  originalPrice: 11999,
  category: 'Jackets',
  sku: 'ARK-OC-2401',
  colors: [
    { name: 'Camel', hex: '#C9A96E' },
    { name: 'Charcoal', hex: '#2C2C2A' },
    { name: 'Stone', hex: '#8A8680' },
    { name: 'Burgundy', hex: '#4A1B0C' },
  ],
  sizes: [
    { label: 'XS', inStock: false },
    { label: 'S', inStock: true },
    { label: 'M', inStock: true },
    { label: 'L', inStock: true },
    { label: 'XL', inStock: true },
    { label: 'XXL', inStock: false },
  ],
  features: [
    '100% Virgin Wool — Sourced from New Zealand',
    'Fully lined with cupro satin',
    'Free shipping on orders above ₹2,000',
    '30-day returns & exchanges',
  ],
  badge: 'New Season',
  rating: { score: 4.8, count: 124 },
}

export default function ProductPage() {
  const [product, setProduct] = useState(FALLBACK_PRODUCT)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [toast, setToast] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          const p = data.data[0]
          setProduct(p)
          setSelectedColor(p.colors[0])
        }
      })
      .catch(() => {
        setSelectedColor(FALLBACK_PRODUCT.colors[0])
      })
  }, [])

  useEffect(() => {
    if (product && product.colors) setSelectedColor(product.colors[0])
  }, [product])

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = async () => {
    if (!selectedSize) { showToast('Please select a size'); return }
    await addToCart({
      productId: product._id,
      productName: product.name,
      color: selectedColor?.name,
      size: selectedSize.label,
      price: product.price,
      qty,
    })
    setAdded(true)
    showToast(`Added — ${selectedColor?.name}, ${selectedSize.label}`)
    setTimeout(() => setAdded(false), 1800)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className={styles.page}>
      {/* Gallery */}
      <div className={styles.gallery}>
        <div className={styles.mainImg}>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
          <div className={styles.imgPlaceholder} style={{ background: selectedColor?.hex + '22' }}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <rect x="30" y="20" width="60" height="80" rx="4" fill={selectedColor?.hex || '#D8D4CE'} opacity="0.4"/>
              <rect x="38" y="28" width="44" height="8" rx="2" fill={selectedColor?.hex || '#C4BFB8'} opacity="0.6"/>
              <rect x="38" y="42" width="44" height="44" rx="2" fill={selectedColor?.hex || '#C4BFB8'} opacity="0.5"/>
            </svg>
          </div>
        </div>
        <div className={styles.thumbs}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${styles.thumb} ${i === 0 ? styles.active : ''}`} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.breadcrumb}>
          Outerwear / <span>{product.category}</span>
        </div>

        <div>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.sku}>SKU: {product.sku}</p>
        </div>

        {product.rating && (
          <div className={styles.rating}>
            <span className={styles.stars}>{'★'.repeat(Math.round(product.rating.score))}</span>
            <span className={styles.ratingText}>{product.rating.score} · {product.rating.count} reviews</span>
          </div>
        )}

        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className={styles.origPrice}>₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
          {discount && <span className={styles.saveBadge}>{discount}% off</span>}
        </div>

        <div className={styles.divider} />

        {/* Color */}
        <div>
          <div className={styles.optLabel}>
            Color — <span>{selectedColor?.name}</span>
          </div>
          <div className={styles.swatches}>
            {product.colors?.map((c) => (
              <div
                key={c.name}
                className={`${styles.swatch} ${selectedColor?.name === c.name ? styles.swatchActive : ''}`}
                style={{ background: c.hex }}
                onClick={() => setSelectedColor(c)}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <div className={styles.optLabel}>
            Size — <span>{selectedSize?.label || 'Select'}</span>
          </div>
          <div className={styles.sizeGrid}>
            {product.sizes?.map((s) => (
              <button
                key={s.label}
                className={`${styles.sizeBtn} ${!s.inStock ? styles.oos : ''} ${selectedSize?.label === s.label ? styles.sizeActive : ''}`}
                disabled={!s.inStock}
                onClick={() => setSelectedSize(s)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Qty */}
        <div>
          <div className={styles.optLabel}>Quantity</div>
          <div className={styles.qtyRow}>
            <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className={styles.qtyVal}>{qty}</span>
            <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
          </div>
        </div>

        <button
          className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
          onClick={handleAddToCart}
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>

        <button className={styles.wishlistBtn}>♡ &nbsp; Save to Wishlist</button>

        <ul className={styles.features}>
          {product.features?.map((f, i) => (
            <li key={i} className={styles.feature}>{f}</li>
          ))}
        </ul>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
