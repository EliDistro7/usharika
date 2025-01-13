import type { Metadata } from "next";


import Script from "next/script";
import "./globals.css";
// import "mdb-react-ui-kit/dist/css/mdb.min.css";






import Header from "@/components/Header";
import Footer from "@/components/Footer";



// Metadata
export const metadata: Metadata = {
  title: "KKKT-Usharika wa Yombo Kuu",
  description: "",
  keywords: "",
 
  icons: {
    icon: "/favicon.ico", // Add a favicon in the public folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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

       
        
  {/* 
   <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
/>
  
  */}             
      

      </head>
      <body>
        
    
      <div id="spinner" className="show w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50  d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-primary" role="status"></div>
        </div>
        
        <Header />
        {children}

        <Footer />

        {/* JavaScript Libraries */}
        <Script
          id="jquery-script"
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"
          strategy="lazyOnload"
        />
      
    
      
      <Script
          id="bootstrap-script"
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      
    
        
        
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
        
    <Script id="main-script22" src="/js/main22.js" strategy='lazyOnload' />
   
      </body>
    </html>
  );
}
