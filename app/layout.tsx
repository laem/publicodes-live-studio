import StyledComponentsRegistry from '../lib/registry'
import styles from './layout.css'

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <header className={styles.header}>
          <img src="/logo-publicodes.svg" className={styles.img} />
          <h1 className={styles.h1}>Publicodes studio live</h1>
        </header>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
