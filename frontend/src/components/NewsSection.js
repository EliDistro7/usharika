
import MainSlider from './MainSlider';


import {updates} from '@/data/main'
import { NewsTicker } from './NewsTicker';






const churchNews = [
  {
    id: 1,
    title: "MASHINDANO YA UIMBAJI KWA VIJANA FEBRUARI 2025",
    image: "img/vijana2024.jpeg",
    category: "Vijana",
    date: "Feb 15, 2025",
    subtitle: "Tunawakaribisha vijana wote kujiunga na kwaya yetu ya Umoja wa Viajana kwa ajili ya mashindano.",
    buttons: [
      { label: "Fahamu zaidi", link: "#", className: "btn-primary" },
      { label: "Jiunge", link: "#", className: "btn-primary" },
    ],
  },
  {
    id: 2,
    title: "JISAJILI KWA NAMBA YA USHARIKA 2025",
    image: "img/usharika.jpg",
    category: "USAJILI",
    date: "Kuanzia Jan, 2025",
    subtitle: "Unaweza kujisajili kwa kupata fomu kutoka kwenye jumuiya au hapa kwa njia ya mtandao",
    buttons: [
      { label: "Maelezo", link: "#", className: "btn-primary" },
      { label: "Jiunge", link: "#", className: "btn-primary" },
    ],
  },
 
];

  

const MainNews = () => {
    // Divide news for sliders
    const featuredNews = churchNews.slice(0, 2);
    const secondaryNews = churchNews.slice(2);
  
    return (
      <div className="container-fluid">
       
        <div className="row">
        {/*  <MainSlider news={featuredNews}    <BreakingNews /> /> */}
        <MainSlider mainSlides={churchNews} secondarySlides={churchNews}/>
        <NewsTicker updates={updates}  direction="left"
  speed="slow"
  pauseOnHover={true}/> 
      
        </div>
     
      </div>
    );
  };
  

  export default MainNews;