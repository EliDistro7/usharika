'use client';

import MainNews from "@/components/NewsSection";
import Pledge from "@/components/Pledge";
import HighlightsWrapper from "@/components/HighlightsWrapper";
import { kipaimara, efm, beach } from '@/data/main';
import {updates} from '@/data/main'
import { NewsTicker } from '@/components/NewsTicker';

export default function Home() {
  const dataSets = [beach,kipaimara, efm];

  return (
    <div>
     
     <NewsTicker updates={updates}  direction="left"
 
  pauseOnHover={true}/> 
      {/* Highlights Section */}
      <HighlightsWrapper  />

      {/* Pledge Section */}
      <Pledge />
       {/* Main News Section */}
       <MainNews />
    </div>
  );
}
