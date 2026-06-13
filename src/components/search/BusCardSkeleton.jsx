import styles from './BusCardSkeleton.module.css'

export default function BusCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.operatorCol}>
        <div className={`${styles.skel} ${styles.logo}`} />
        <div className={styles.operatorLines}>
          <div className={`${styles.skel} ${styles.lineWide}`} />
          <div className={`${styles.skel} ${styles.lineNarrow}`} />
        </div>
      </div>

      <div className={styles.routeCol}>
        <div className={`${styles.skel} ${styles.time}`} />
        <div className={`${styles.skel} ${styles.lineFill}`} />
        <div className={`${styles.skel} ${styles.time}`} />
      </div>

      <div className={styles.metaCol}>
        <div className={`${styles.skel} ${styles.lineNarrow}`} />
        <div className={`${styles.skel} ${styles.lineNarrow}`} />
      </div>

      <div className={styles.priceCol}>
        <div className={`${styles.skel} ${styles.priceSkel}`} />
        <div className={`${styles.skel} ${styles.btnSkel}`} />
      </div>
    </div>
  )
}
