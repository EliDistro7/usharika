'use client';


import MainNews from "@/components/NewsSection"
import Pledge from "@/components/Pledge";
import VideoCard from "@/components/VideoCard";
import VideoGallery from "@/components/VideoGallery";
import Joy from "@/components/xmass/Joy";
import SnowyTree from "@/components/xmass/SnowyTree";
import Highlights from "@/components/Highlights";

import { content, churchContent, efm, videos, kipaimara } from '@/data/main';
//import dynamic from "next/dynamic";

const sections = [
  { name: "Church Content", content: { ...churchContent } },
  { name: "EFM", content: { ...efm } },
  { name: "Another Section", content: { ...churchContent } },
];

/*
const MainNews = dynamic(() => import("@/components/NewsSection"), {
  ssr: false,
});

*/
export default function Home() {
  return (
    <div>
     {/* <MainNews /> */}
     <MainNews />
     


<div className='container-fluid'>
      <Highlights data={kipaimara} />
      <Highlights data={efm} />
      <Highlights data={churchContent} />
      
      {/*<Highlights data={churchContent} />
           
      */}

</div>


      <Pledge />
    </div>
  );
}
