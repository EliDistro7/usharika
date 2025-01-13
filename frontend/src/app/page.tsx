'use client';

import MainNews from "@/components/NewsSection";
import Pledge from "@/components/Pledge";
import HighlightsWrapper from "@/components/HighlightsWrapper";
import { kipaimara, efm, beach } from '@/data/main';

export default function Home() {
  const dataSets = [beach,kipaimara, efm];

  return (
    <div>
      {/* Main News Section */}
      <MainNews />

      {/* Highlights Section */}
      <HighlightsWrapper  />

      {/* Pledge Section */}
      <Pledge />
    </div>
  );
}
