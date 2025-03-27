import ImageUploader from "@/components/image-uploader"
import ImageGallery from "@/components/image-gallery"
import ConnectionStatus from "@/components/connection-status"
import TroubleshootingGuide from "@/components/troubleshooting-guide"
import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className="header">
          <h1>CloudFire Image Manager</h1>
          <p>Upload, view, and manage your Cloudflare images</p>
        </header>
        <ImageUploader />
        <ImageGallery />
      </div>
    </main>
  )
}

