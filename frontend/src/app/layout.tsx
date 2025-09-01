import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
///import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import Header from "@/components/Header";

// Metadata
export const metadata: Metadata = {
  title: "KKKT-Usharika wa Yombo",
  description: "Connect with Yombo KKKT - sermons, events, prayer requests, and community updates",
  keywords: "KKKT, Yombo, church, sermons, events, prayer, community, tanzania",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6b46c1" },
    { media: "(prefers-color-scheme: dark)", color: "#553c9a" }
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yombo KKKT",
  },
  other: {
    "msapplication-TileColor": "#6b46c1",
    "msapplication-navbutton-color": "#6b46c1",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
    "application-name": "Yombo KKKT",
    "format-detection": "telephone=no",
    "msapplication-tap-highlight": "no",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json", // PWA manifest
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Enhanced Windows-specific tile colors */}
        <meta name="msapplication-TileColor" content="#6b46c1" />
        <meta name="msapplication-navbutton-color" content="#6b46c1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* iOS Safari specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Yombo KKKT" />
        
        {/* Android Chrome specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Yombo KKKT" />
        
        {/* Initial theme color */}
        <meta name="theme-color" content="#6b46c1" />
        
        {/* Favicons and icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Google Web Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* Icon Font Stylesheet */}
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>

      <body>
        <Spinner />
         <Header  />
        {children}
        <Footer />

        {/* JavaScript Libraries */}
     

      

        <Script
          id="wow-script"
          src="/lib/wow/wow.min.js"
          strategy="lazyOnload"
        />
        <Script
          id="easing-script"
          src="/lib/easing/easing.min.js"
          strategy="lazyOnload"
        />
        <Script
          id="waypoints-script"
          src="/lib/waypoints/waypoints.min.js"
          strategy="lazyOnload"
        />
        <Script
          id="lightbox-script"
          src="/lib/lightbox/js/lightbox.min.js"
          strategy="lazyOnload"
        />
        <Script
          id="owlcarousel-script"
          src="/lib/owlcarousel/owl.carousel.min.js"
          strategy="lazyOnload"
        />

        <Script
          id="calendar-script"
          src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.4/index.global.min.js"
          strategy="beforeInteractive"
        />

        <Script id="main-script22" src="/js/main22.js" strategy="lazyOnload" />

        {/* PWA Installation Prompt Script - No Service Worker */}
        <Script id="pwa-install" strategy="afterInteractive">
          {`
            let deferredPrompt;
            let installButton;

            // Listen for the beforeinstallprompt event
            window.addEventListener('beforeinstallprompt', (e) => {
              console.log('PWA install prompt available');
              e.preventDefault();
              deferredPrompt = e;
              
              // Show install button or banner
              showInstallPromotion();
            });

            // Show install promotion
            function showInstallPromotion() {
              // Create install button if it doesn't exist
              if (!document.getElementById('pwa-install-btn')) {
                const installBtn = document.createElement('button');
                installBtn.id = 'pwa-install-btn';
                installBtn.innerHTML = '📱 Install App';
                installBtn.className = 'btn btn-outline-light position-fixed';
                installBtn.style.cssText = \`
                  bottom: 20px;
                  right: 20px;
                  z-index: 1000;
                  border-radius: 25px;
                  padding: 10px 20px;
                  background: #6b46c1;
                  border-color: #6b46c1;
                  box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
                  display: none;
                \`;
                
                installBtn.addEventListener('click', installPWA);
                document.body.appendChild(installBtn);
                installButton = installBtn;
              }
              
              // Show the button with animation
              if (installButton) {
                installButton.style.display = 'block';
                setTimeout(() => {
                  installButton.style.transform = 'translateY(0)';
                  installButton.style.opacity = '1';
                }, 100);
              }
            }

            // Install PWA function
            async function installPWA() {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                  console.log('User accepted the install prompt');
                } else {
                  console.log('User dismissed the install prompt');
                }
                
                deferredPrompt = null;
                
                // Hide install button
                if (installButton) {
                  installButton.style.display = 'none';
                }
              }
            }

            // Listen for successful installation
            window.addEventListener('appinstalled', (evt) => {
              console.log('PWA was installed successfully');
              
              // Hide install button
              if (installButton) {
                installButton.style.display = 'none';
              }
              
              // Optional: Show thank you message
              if (typeof window.showToast === 'function') {
                window.showToast('Yombo KKKT app installed successfully! 🎉', 'success');
              }
            });

            // Check if already installed (running in standalone mode)
            if (window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true) {
              console.log('PWA is already installed and running in standalone mode');
              // Hide any install prompts
              const existingBtn = document.getElementById('pwa-install-btn');
              if (existingBtn) {
                existingBtn.style.display = 'none';
              }
            }
          `}
        </Script>

        {/* Enhanced PWA Meta Theme Color Update */}
        <Script id="theme-color-manager" strategy="afterInteractive">
          {`
            // Update theme color based on page or time
            function updateThemeColor(color = '#6b46c1') {
              const metaThemeColor = document.querySelector('meta[name="theme-color"]');
              if (metaThemeColor) {
                metaThemeColor.setAttribute('content', color);
              }
            }

            // Optional: Change theme color based on page
            function setPageThemeColor() {
              const path = window.location.pathname;
              let color = '#6b46c1'; // Default purple
              
              switch(path) {
                case '/prayer':
                  color = '#7c3aed'; // Darker purple for prayer
                  break;
                case '/events':
                  color = '#8b5cf6'; // Lighter purple for events
                  break;
                case '/sermons':
                  color = '#6366f1'; // Blue-purple for sermons
                  break;
                case '/give':
                  color = '#10b981'; // Green for giving
                  break;
                default:
                  color = '#6b46c1'; // Default purple
              }
              
              updateThemeColor(color);
            }

            // Set theme color on page load
            document.addEventListener('DOMContentLoaded', setPageThemeColor);
            
            // Update theme color on navigation (for SPA routing)
            window.addEventListener('popstate', setPageThemeColor);
          `}
        </Script>
      </body>
    </html>
  );
}