import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import styles from './ProductPage.module.css'

const API = import.meta.env.VITE_API_URL || '/api'

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
  images: [
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  ],
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
          // merge API product with fallback images if API has none
          const merged = {
            ...p,
            images: p.images?.length ? p.images : FALLBACK_PRODUCT.images
          }
          setProduct(merged)
          setSelectedColor(merged.colors[0])
          setActiveImg(0)
          setSelectedSize(null)
        }
      })
      .catch(() => {
        setSelectedColor(FALLBACK_PRODUCT.colors[0])
      })
  }, [])

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

  const images = product.images?.length ? product.images : FALLBACK_PRODUCT.images

  return (
    <div className={styles.page}>
      <div className={styles.gallery}>
        <div className={styles.mainImg}>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
          <img
            src={images[activeImg]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <div
              key={i}
              className={`${styles.thumb} ${i === activeImg ? styles.active : ''}`}
              onClick={() => setActiveImg(i)}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
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