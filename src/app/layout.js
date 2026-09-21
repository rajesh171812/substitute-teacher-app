import "../components/subtrack/tokens.css";
import "../components/subtrack/bundle.css";
import "../components/subtrack/subtrack-theme.css";
import "../components/subtrack/subtrack-app.css";

export const metadata = {
  title: "SubTrack",
  description: "Schedule, earnings and schools for substitute teachers.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono&display=swap" />
      </head>
      <body className="bl-body">{children}</body>
    </html>
  );
}
