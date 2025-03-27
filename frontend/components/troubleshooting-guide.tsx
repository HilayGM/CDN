"use client"

import { useState } from "react"
import styles from "./troubleshooting-guide.module.css"

export default function TroubleshootingGuide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.troubleshooting}>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Troubleshooting Guide" : "Show Troubleshooting Guide"}
      </button>

      {isOpen && (
        <div className={styles.guide}>
          <h3>Troubleshooting Connection Issues</h3>

          <div className={styles.section}>
            <h4>Error: Cannot connect to the server</h4>
            <ol>
              <li>Make sure your backend server is running on port 3001</li>
              <li>Check if you have any firewall or antivirus blocking the connection</li>
              <li>
                Verify that the server URL in the frontend matches your backend (currently set to http://localhost:3001)
              </li>
            </ol>
          </div>

          <div className={styles.section}>
            <h4>Error: getaddrinfo ENOTFOUND api.cloudflare.com</h4>
            <ol>
              <li>Check your internet connection</li>
              <li>Verify that your DNS settings are correct</li>
              <li>Try using a different DNS server temporarily</li>
              <li>If you're behind a proxy or VPN, try disabling it temporarily</li>
              <li>Check if your hosts file has any entries for api.cloudflare.com</li>
            </ol>
          </div>

          <div className={styles.section}>
            <h4>Error: Cloudflare API authentication issues</h4>
            <ol>
              <li>Verify that your CLOUDFLARE_TOKEN environment variable is set correctly</li>
              <li>Check that your CLOUDFLARE_ACCOUNT_ID is correct</li>
              <li>Ensure your Cloudflare token has the necessary permissions</li>
              <li>Check if your Cloudflare token has expired</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

