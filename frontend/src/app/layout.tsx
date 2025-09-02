import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
///import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import Header from "@/components/Header";
import PushNotificationManager from "@/components/features/PushNotificationsManager"; // Add this import

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
        <Header />
        <PushNotificationManager /> {/* Add this component */}
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

        {/* Service Worker Registration for Push Notifications */}
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            // Register service worker for push notifications
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('Service Worker registered successfully');
                  })
                  .catch(function(error) {
                    console.log('Service Worker registration failed:', error);
                  });
              });
            }
          `}
        </Script>

        {/* REPLACE THIS ENTIRE SCRIPT BLOCK WITH THE ENHANCED VERSION */}
        <Script id="pwa-install" strategy="afterInteractive">
          {`
            // Enhanced PWA Installation Script
            let deferredPrompt;
            let installButton;

            console.log('PWA Install script initialized');

            // Check PWA installation criteria
            function checkPWAReadiness() {
              const checks = {
                https: location.protocol === 'https:' || location.hostname === 'localhost',
                serviceWorker: 'serviceWorker' in navigator,
                manifest: document.querySelector('link[rel="manifest"]') !== null,
                standalone: !window.matchMedia('(display-mode: standalone)').matches
              };
              
              console.log('PWA Readiness Check:', checks);
              return checks;
            }

            // Listen for the beforeinstallprompt event
            window.addEventListener('beforeinstallprompt', (e) => {
              console.log('✅ beforeinstallprompt event fired!');
              e.preventDefault();
              deferredPrompt = e;
              
              showInstallPromotion();
            });

            // Show install promotion
            function showInstallPromotion() {
              console.log('Showing install promotion...');
              
              // Remove existing button
              const existingBtn = document.getElementById('pwa-install-btn');
              if (existingBtn) {
                existingBtn.remove();
              }
              
              // Create install button
              const installBtn = document.createElement('button');
              installBtn.id = 'pwa-install-btn';
              installBtn.innerHTML = '📱 Install App';
              
              // Apply styles directly
              Object.assign(installBtn.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '9999',
                padding: '12px 24px',
                backgroundColor: '#6b46c1',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                boxShadow: '0 4px 12px rgba(107, 70, 193, 0.3)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                display: 'block'
              });
              
              installBtn.addEventListener('click', installPWA);
              document.body.appendChild(installBtn);
              installButton = installBtn;
              
              console.log('✅ Install button added to DOM');
            }

            // Install PWA function
            async function installPWA() {
              console.log('Install button clicked');
              
              if (deferredPrompt) {
                try {
                  await deferredPrompt.prompt();
                  const choiceResult = await deferredPrompt.userChoice;
                  
                  console.log('User choice result:', choiceResult.outcome);
                  
                  if (choiceResult.outcome === 'accepted') {
                    console.log('✅ User accepted install prompt');
                  } else {
                    console.log('❌ User dismissed install prompt');
                  }
                  
                  deferredPrompt = null;
                  hideInstallButton();
                  
                } catch (error) {
                  console.error('Error during installation:', error);
                }
              } else {
                console.log('No deferred prompt - showing manual instructions');
                showManualInstallInstructions();
              }
            }

            // Hide install button
            function hideInstallButton() {
              if (installButton) {
                installButton.style.display = 'none';
                console.log('Install button hidden');
              }
            }

            // Show manual install instructions
            function showManualInstallInstructions() {
              const userAgent = navigator.userAgent.toLowerCase();
              let instructions = '';
              
              if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
                instructions = 'Safari: Tap the Share button (📤) → "Add to Home Screen"';
              } else if (userAgent.includes('firefox')) {
                instructions = 'Firefox: Menu (⋮) → "Install"';
              } else if (userAgent.includes('chrome') || userAgent.includes('edge')) {
                instructions = 'Look for the install icon (📱) in your browser\\'s address bar';
              } else {
                instructions = 'Check your browser menu for "Install" or "Add to Home Screen" option';
              }
              
              alert(\`To install Yombo KKKT app:\\n\\n\${instructions}\`);
            }

            // Listen for successful installation
            window.addEventListener('appinstalled', (evt) => {
              console.log('✅ PWA installed successfully');
              hideInstallButton();
              
              if (typeof window.showToast === 'function') {
                window.showToast('Yombo KKKT app installed successfully! 🎉', 'success');
              }
            });

            // Check if already installed
            function isAlreadyInstalled() {
              const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                               window.navigator.standalone === true;
              
              if (standalone) {
                console.log('✅ PWA is running in standalone mode (already installed)');
                return true;
              }
              
              return false;
            }

            // Force show install button (for testing)
            function forceShowInstallButton() {
              console.log('🔧 Force showing install button for testing');
              showInstallPromotion();
            }

            // Make functions available globally for testing
            window.forceShowInstallButton = forceShowInstallButton;
            window.checkPWAReadiness = checkPWAReadiness;

            // Initialize when DOM is ready
            document.addEventListener('DOMContentLoaded', () => {
              console.log('🚀 PWA script initialized');
              
              // Check readiness
              checkPWAReadiness();
              
              // Don't show button if already installed
              if (isAlreadyInstalled()) {
                console.log('Already installed, skipping install button');
                return;
              }
              
              console.log('Waiting for beforeinstallprompt event...');
              
              // Fallback: Show generic instructions after delay
              setTimeout(() => {
                if (!deferredPrompt && !installButton) {
                  console.log('⚠️ No beforeinstallprompt after 5 seconds');
                  console.log('This is normal for Safari, Firefox, or if criteria not met');
                }
              }, 5000);
            });
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