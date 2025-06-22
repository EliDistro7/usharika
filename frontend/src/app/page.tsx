'use client';

import MainNews from "@/components/NewsSection";
import Pledge from "@/components/Pledge";
import HighlightsWrapper from "@/components/HighlightsWrapper";
import { kipaimara, efm, beach } from '@/data/main';
//import {updates} from '@/data/main'
import { NewsTicker } from '@/components/NewsTicker';
import FutureEventsCarousel from "@/components/xmass/FutureEventsCarousel";
import Series from '@/components/admins/Series';
import LiveSeries from '@/components/series/LiveSeries';

export default function Home() {
  const dataSets = [beach,kipaimara, efm];

  return (
    <div className="px-0">
     
     <NewsTicker  direction="left"
    className=""
  pauseOnHover={true}/> 
      {/* Highlights  <Series />
      Section */}
   
      <HighlightsWrapper  />

      {/* Pledge Section */}
      <Pledge />
       {/* Main News<MainNews /> Section */}
       <FutureEventsCarousel />
    </div>
  );
}
