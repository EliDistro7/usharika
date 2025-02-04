

import React from "react";
import SlideCarousel from "../SlideCarousel"; // Adjust the path as necessary
import {CountdownDisplay} from "./CountDown"; // Adjust the path as necessary

const FutureEventsCarousel = () => {
  const events = [
 
    {
      targetDate: "2025-02-14T00:00:00Z",
      eventName: "The Cross Episode II",
      backgroundImage: "/img/cross.jpeg",
    },
    {
      targetDate: "2025-03-25T00:00:00Z",
      eventName: "Tamasha la Muziki",
      backgroundVideo: "https://res.cloudinary.com/df9gkjxm8/video/upload/v1736323913/profile/yghwfekbdmjtou9kbv97.mp4",
    },
  ];

  return (
    <div className="container-fluid text-center px-0 ">
      <SlideCarousel>
        {events.map((event, index) => (
          <div key={index}>
            <CountdownDisplay
              targetDate={event.targetDate}
              eventName={event.eventName}
              backgroundImage={event.backgroundImage}
              backgroundVideo={event.backgroundVideo}
            />
          </div>
        ))}
      </SlideCarousel>
    </div>
  );
};

export default FutureEventsCarousel;
