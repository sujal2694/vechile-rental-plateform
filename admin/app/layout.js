import './globals.css'
import { Outfit, Ovo } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'] })
const ovo = Ovo({ weight: '400', subsets: ['latin'] })

export const metadata = {
  title: 'MotiveRide Admin',
  description: 'Admin Panel for Vehicle Rental Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.boxicons.com/3.0.8/fonts/basic/boxicons.min.css" rel="stylesheet"></link>
      </head>
      <body className={`${outfit.className} ${ovo.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}
