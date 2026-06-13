import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.sub}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')}>Back to home</Button>
    </div>
  )
}
