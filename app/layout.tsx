import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { jetBrainsMono, notoSans } from "@/components/ui/fonts"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Kenji Wilkins",
  description: "Frontend developer with 5+ years of experience",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetBrainsMono.variable} ${notoSans.variable} antialiased`}>
        <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
