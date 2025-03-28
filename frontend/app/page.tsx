import ImageGallery from "@/components/image-gallery"
import ImageUploader from "@/components/image-uploader"
import ConnectionStatus from "@/components/connection-status"
import TroubleshootingGuide from "@/components/troubleshooting-guide"
import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className="header">
          <h1>CloudFlare Image Manager</h1>
          <p>Galería de imágenes de Cloudflare</p>
        </header>

        <ConnectionStatus />
        <TroubleshootingGuide />
        <ImageUploader />
        <ImageGallery />
      </div>
    </main>
  )
}

