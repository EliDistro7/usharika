


import AboutSection from "@/components/about/About";
import MissionVision from "@/components/about/MissionVision";
import Leadership from "@/components/about/Leadership";
import ProgramsServices from "@/components/about/ProgramsServices";
//import dynamic from "next/dynamic";

/*
const MainNews = dynamic(() => import("@/components/NewsSection"), {
  ssr: false,
});

*/
export default function About() {
  return (
    <div>
    <AboutSection />
    <MissionVision />
   
    <ProgramsServices />
    </div>
  );
}
