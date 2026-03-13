import "./globals.css";

export const metadata = {
  title: "Sub Teacher Dashboard",
  description: "Substitute teacher scheduling, schools, and earnings tracker",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#F2F2F7" />
      </head>
      <body>{children}</body>
    </html>
  );
}
