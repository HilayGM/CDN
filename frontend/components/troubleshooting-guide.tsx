"use client"

import { useState } from "react"
import styles from "./troubleshooting-guide.module.css"

export default function TroubleshootingGuide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.troubleshooting}>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Ocultar guía de solución de problemas" : "Mostrar guía de solución de problemas"}
      </button>

      {isOpen && (
        <div className={styles.guide}>
          <h3>Solución de problemas de conexión</h3>

          <div className={styles.section}>
            <h4>Error: No se puede conectar al servidor</h4>
            <ol>
              <li>Asegúrate de que tu servidor backend esté ejecutándose en el puerto 3001</li>
              <li>Verifica si tienes algún firewall o antivirus bloqueando la conexión</li>
              <li>
                Comprueba que la URL del servidor en el frontend coincida con tu backend (actualmente configurado como
                http://localhost:3001)
              </li>
            </ol>
          </div>

          <div className={styles.section}>
            <h4>Error: getaddrinfo ENOTFOUND api.cloudflare.com</h4>
            <ol>
              <li>Verifica tu conexión a Internet</li>
              <li>Comprueba que tu configuración DNS sea correcta</li>
              <li>Intenta usar un servidor DNS diferente temporalmente</li>
              <li>Si estás detrás de un proxy o VPN, intenta desactivarlo temporalmente</li>
              <li>Verifica si tu archivo hosts tiene alguna entrada para api.cloudflare.com</li>
            </ol>
          </div>

          <div className={styles.section}>
            <h4>Error: Problemas con las imágenes de Cloudflare</h4>
            <ol>
              <li>Verifica que tu variable de entorno CLOUDFLARE_TOKEN esté configurada correctamente</li>
              <li>Comprueba que tu CLOUDFLARE_ACCOUNT_ID sea correcto</li>
              <li>
                Asegúrate de que tu CLOUDFLARE_ACCOUNT_HASH esté configurado (necesario para las URLs de imágenes)
              </li>
              <li>Verifica que tu token de Cloudflare tenga los permisos necesarios</li>
              <li>Comprueba si tu token de Cloudflare ha expirado</li>
            </ol>
          </div>

          <div className={styles.section}>
            <h4>Variables de entorno necesarias</h4>
            <p>Asegúrate de tener estas variables en tu archivo .env del backend:</p>
            <pre>
              CLOUDFLARE_TOKEN=tu_token_aquí CLOUDFLARE_ACCOUNT_ID=tu_account_id_aquí
              CLOUDFLARE_ACCOUNT_HASH=tu_account_hash_aquí
            </pre>
            <p>Y esta variable en tu archivo .env.local del frontend:</p>
            <pre>NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH=tu_account_hash_aquí</pre>
          </div>
        </div>
      )}
    </div>
  )
}

