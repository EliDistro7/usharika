
import MainSlider from './MainSlider';

import BreakingNews from './BreakingNews';
import {updates} from '@/data/main'
import { NewsTicker } from './NewsTicker';
import SnowyTree from './xmass/SnowyTree';





const churchNews = [
  {
    id: 1,
    title: "Ibada Kuu Ya Mwaka Kuadhimishwa Wiki Ijayo",
    image: "img/worship1.jpg",
    category: "Ibada",
    date: "Novemba 24, 2024",
    subtitle: "A special celebration of the year's worship services.",
    buttons: [
      { label: "Read More", link: "#", className: "btn-primary" },
      { label: "Join Event", link: "#", className: "btn-outline-primary" },
    ],
  },
  {
    id: 2,
    title: "Ibada ya Mwaka Mpya 2025",
    image: "img/usharika.jpg",
    category: "Watoto",
    date: "Novemba 25, 2024",
    subtitle: "A special mass for children will take place this Sunday.",
    buttons: [
      { label: "Details", link: "#", className: "btn-primary" },
      { label: "Join Now", link: "#", className: "btn-outline-primary" },
    ],
  },
  {
    id: 3,
    title: "Semina Ya Vijana: Kukua Katika Imani",
    image: "img/praying-together.jpg",
    category: "Vijana",
    date: "Novemba 26, 2024",
    subtitle: "Youth seminar focused on growing in faith and spirituality.",
    buttons: [
      { label: "Learn More", link: "#", className: "btn-primary" },
      { label: "Register", link: "#", className: "btn-outline-primary" },
    ],
  },
  {
    id: 4,
    title: "Kwaya Itazindua Albamu Mpya Jumamosi",
    image: "img/mabenchi1.jpg",
    category: "Muziki",
    date: "Novemba 27, 2024",
    subtitle: "The choir will launch a new album this Saturday.",
    buttons: [
      { label: "View Album", link: "#", className: "btn-primary " },
      { label: "Listen Now", link: "#", className: "btn-outline-primary " },
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
  speed="fast"
  pauseOnHover={true}/> 
      
        </div>
     
      </div>
    );
  };
  

  export default MainNews;