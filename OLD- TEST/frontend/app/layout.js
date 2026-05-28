import "./globals.css";

export const metadata = {
  title: "ClickMyVenue | India's Premium Venue Discovery & Booking Portal",
  description: "Find the perfect wedding lawn, banquet hall, luxury resort, or rooftop party venue in India. Check pricing, availability, and book instantly.",
  keywords: ["wedding venues", "banquet halls", "party lawns", "corporate event venues", "clickmyvenue", "venue booking India"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
