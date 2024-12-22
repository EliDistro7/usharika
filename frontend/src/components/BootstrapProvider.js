
"use client";


import SSRProvider from 'react-bootstrap/SSRProvider';


export default function BootstrapProvider({ children }) {


  return (<>
  <SSRProvider>
  
  {children}
  </SSRProvider>
  </>);
}
