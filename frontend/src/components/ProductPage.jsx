import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import styles from './ProductPage.module.css'

const API = import.meta.env.VITE_API_URL || '/api'

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800',
  'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800',
]

const COLOR_TINTS = {
  Camel: 'rgba(201,169,110,0.12)',
  Charcoal: 'rgba(44,44,42,0.3)',
  Stone: 'rgba(138,134,128,0.2)',
  Burgundy: 'rgba(74,27,12,0.3)',
}

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
  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(FALLBACK_PRODUCT.colors[0])
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
          setActiveImg(0)
          setSelectedSize(null)
        }
      })
      .catch(() => {
        setSelectedColor(FALLBACK_PRODUCT.colors[0])
      })
  }, [])

  const tint = COLOR_TINTS[selectedColor?.name] || 'transparent'

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
      <div className={styles.gallery}>

        {/* Main Image */}
        <div className={styles.mainImg}>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={PRODUCT_IMAGES[activeImg]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: tint,
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
              transition: 'background 0.3s ease'
            }} />
          </div>
        </div>

        {/* Thumbnails */}
        <div className={styles.thumbs}>
          {PRODUCT_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`${styles.thumb} ${i === activeImg ? styles.active : ''}`}
              onClick={() => setActiveImg(i)}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <img
                src={img}
                alt={`view ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: tint,
                mixBlendMode: 'multiply',
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>

      </div>

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
        <div>
          <div className={styles.optLabel}>Color — <span>{selectedColor?.name}</span></div>
          <div className={styles.swatches}>
            {product.colors?.map((c) => (
              <div
                key={c.name}
                className={`${styles.swatch} ${selectedColor?.name === c.name ? styles.swatchActive : ''}`}
                style={{ background: c.hex }}
                onClick={() => { setSelectedColor(c); setActiveImg(0); }}
                title={c.name}
              />
            ))}
          </div>
        </div>
        <div>
          <div className={styles.optLabel}>Size — <span>{selectedSize?.label || 'Select'}</span></div>
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