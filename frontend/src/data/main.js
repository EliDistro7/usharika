export const slides = [
    (
      <div
        className="carousel-slide"
        style={{
          backgroundImage: "url('img/worship1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div
          className="container py-5 position-relative z-2 text-white px-3"
          style={{ height: "100%" }}
        >
          <div className="row g-5 h-100 align-items-center">
            <div className="col-lg-7 col-md-12">
              <h1 className="mb-3 text-primary">Karibu KKKT Usharika wa Yombo!</h1>
              <h1 className="mb-5 display-1 text-white">
                Ibada zinaendelea Kila Jumapili
              </h1>
              <p className="mb-4">
                Jiunge nasi katika kumtukuza Mungu na kujifunza Neno lake
              </p>
              <a
                href="#about"
                className="btn btn-primary px-4 py-3 mb-3 px-md-5 me-4 btn-border-radius"
              >
                Jifunze Zaidi
              </a>
              <a
                href="#services"
                className="btn btn-primary px-4 py-3 px-md-5 btn-border-radius"
              >
                Tembelea Usharika
              </a>
            </div>
          </div>
        </div>
      </div>
    ),
    (
      <div
        className="carousel-slide"
        style={{
          backgroundImage: "url('img/mabenchi1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div
          className="container py-5 position-relative z-2 text-white px-3"
          style={{ height: "100%" }}
        >
          <div className="row g-5 h-100 align-items-center">
            <div className="col-lg-7 col-md-12">
              <h1 className="mb-3 text-primary">Changia Ujenzi wa Kanisa</h1>
              <h1 className="mb-5 display-1 text-white">
                Tunahitaji Msaada Wako!
              </h1>
              <p className="mb-4">
                Tushirikiane katika kufanikisha ujenzi wa kanisa letu.
              </p>
              <div
                className="p-3 bg-light text-dark rounded mb-4 shadow"
                style={{
                  display: "inline-block",
                  backdropFilter: "blur(10px)",
                }}
              >
                <strong>Malengo:</strong> TZS 50,000,000
                <br />
                <strong>Tarehe ya Mwisho:</strong> 31 Desemba 2024
              </div>
              <a
                href="#donate"
                className="btn btn-primary px-4 py-3 mb-3 px-md-5 me-4 btn-border-radius"
              >
                Changia Sasa
              </a>
              <a
                href="#learn-more"
                className="btn btn-primary px-4 py-3 px-md-5 btn-border-radius"
              >
                Jifunze Zaidi
              </a>
            </div>
          </div>
        </div>
      </div>
    ),
  ];
  

  export const updates = [
    {
      content: "Jiunge nasi kwa semina maalum ya vijana, tukiwa na ujumbe wa matumaini na mwongozo wa kiroho.",
      group: "Youth",
    },
    {
      content: "Kila mmoja anakaribishwa kuhudhuria mkutano wetu wa maombi kwa ajili ya familia na jamii.",
      group: "Prayer Meeting",
    },
    {
      content: "Shiriki nasi katika kujifunza neno la Mungu kwa kina.",
      group: "Bible Study",
    },
  ];

  export const videos = [
    {
      videoSrc: "https://www.youtube.com/embed/urWBW0MRsiw",
      thumbnail: "/img/daycare.jpg",
      title: "Yombo Day care",
      description: "Mlete mwanao apate elimu bora .",
    },
    {
      videoSrc: "https://www.youtube.com/embed/vEJuOF73G8I",
      thumbnail: "/img/praise1.jpg",
      title: "Ibada ya mkesha",
      description: "Ijumaa 22/11/2024",
    },
    {
      videoSrc: "https://www.youtube.com/embed/ZJwovE4j0gA",
      thumbnail: "/img/blog-3.jpg",
      title: "Media Tour EFM",
      description: "16/07/2024",
    },
    {
      videoSrc: "https://www.youtube.com/embed/KX2FQ_jR9To",
      thumbnail: "/img/city.jpg",
      title: "Kwaya ya Umoja wa Vijana ikiimba wimbo wa 'Baba yetu' ",
      description: "Join us as we celebrate milestones achieved together.",
    },
  ];


  export const pastoralTeam = [
    {
      image: "img/team-1.jpg",
      name: "Linda Carlson",
      role: "English Teacher",
      delay: "0.1s",
      socialLinks: [
        { url: "#", icon: "fas fa-share-alt" },
        { url: "#", icon: "fab fa-facebook-f" },
        { url: "#", icon: "fab fa-twitter" },
        { url: "#", icon: "fab fa-instagram" },
      ],
    },
    {
      image: "img/team-2.jpg",
      name: "John Doe",
      role: "Math Teacher",
      delay: "0.3s",
      socialLinks: [
        { url: "#", icon: "fas fa-share-alt" },
        { url: "#", icon: "fab fa-facebook-f" },
        { url: "#", icon: "fab fa-twitter" },
        { url: "#", icon: "fab fa-instagram" },
      ],
    },
    {
      image: "img/team-3.jpg",
      name: "Jane Smith",
      role: "Science Teacher",
      delay: "0.5s",
      socialLinks: [
        { url: "#", icon: "fas fa-share-alt" },
        { url: "#", icon: "fab fa-facebook-f" },
        { url: "#", icon: "fab fa-twitter" },
        { url: "#", icon: "fab fa-instagram" },
      ],
    },
    {
      image: "img/team-4.jpg",
      name: "Emily Davis",
      role: "History Teacher",
      delay: "0.7s",
      socialLinks: [
        { url: "#", icon: "fas fa-share-alt" },
        { url: "#", icon: "fab fa-facebook-f" },
        { url: "#", icon: "fab fa-twitter" },
        { url: "#", icon: "fab fa-instagram" },
      ],
    },
  ];
  
  
  export const eldersCouncil = [
    { image: "img/elder-1.jpg", name: "Elder Peter", role: "Mzee wa Kanisa", delay: "0.2s" },
  ];
  
  export const fathersGroup = [
    { image: "img/father-1.jpg", name: "James Smith", role: "Kiongozi wa Wababa", delay: "0.3s" },
  ];
  
  export const mothersGroup = [
    { image: "img/mother-1.jpg", name: "Mary Johnson", role: "Kiongozi wa Wamama", delay: "0.4s" },
  ];
  
  export const youthGroup = [
    { image: "img/youth-1.jpg", name: "John Junior", role: "Kiongozi wa Vijana", delay: "0.5s" },
  ];
  
  export const bibleStudy = [
    { image: "img/biblestudy-1.jpg", name: "Sarah Lee", role: "Kiongozi wa Biblia", delay: "0.6s" },
  ];
  
  export const choirs = [
    {
      image: "img/choir-main.jpg",
      name: "Kwaya Kuu",
      role: "Waimbaji Wakuu",
      delay: "0.7s",
    },
    {
      image: "img/youth-choir.jpg",
      name: "Kwaya ya Umoja wa Vijana",
      role: "Waimbaji wa Vijana",
      delay: "0.8s",
    },
    {
      image: "img/evangelism-choir.jpg",
      name: "Kwaya ya Uinjilisti",
      role: "Waimbaji wa Injili",
      delay: "0.9s",
    },
    {
      image: "img/mothers-choir.jpg",
      name: "Kwaya ya Wamama",
      role: "Waimbaji wa Wamama",
      delay: "1.0s",
    },
    {
      image: "img/men-choir.jpg",
      name: "Kwaya ya Wanaume",
      role: "Waimbaji wa Wanaume",
      delay: "1.1s",
    },
  ];
  

  
export const churchContent = {
  name:'Matukio kati picha Ubarikio 2024',
  content: [
    {
      groupName: "Watumishi waliohudumu",
      content: [
        {
          title: "",
          description: "Ibada iliongozwa na mkuu wa jimbo",
          imageUrl: "/img/mkuuwajimbo2.jpg", // Optional Material 
        },
        {
          title: "Kwaya",
          description: "Parish worker...",
          videoUrl: "/videos/worthy.mp4", // Optional video URL;
        },
        {
          title: "Wabarikia",
          description: "Reflect on the sermon from our Sunday service.",
          imageUrl: "/img/wabarikiwa.jpg",
        },
        {
          title: "Community Prayer",
          description: "Come together to pray for our community and church.",
          imageUrl: "/img/pray-church.jpg",
          
        },
      ],
    },
    {
      groupName: "Youth Fellowship",
      content: [
        {
          title: "Youth Empowerment Talk",
          description: "Guest speaker shares insights on leadership and personal growth.",
          imageUrl: "/img/youth.jpg",
        
        },
        {
          title: "Praise and Worship",
          description: "A lively and energetic time of praise with the youth group.",
          imageUrl: "/img/youth-praise.jpg",
        },
        {
          title: "Group Activities",
          description: "Fun and engaging activities for youth to bond and grow in faith.",
          imageUrl: "/img/youth-activities.jpg",
        },
      ],
    },
    {
      groupName: "Bible Study",
      content: [
        {
          title: "Bible Study Session 1",
          description: "Deep dive into the teachings of the Bible and how they apply to our lives.",
          imageUrl: "/img/bible.jpg",
          
        },
        {
          title: "Group Discussion",
          description: "Small group discussions to better understand the scripture.",
          imageUrl: "/img/group-discussion.jpg",
        },
        {
          title: "Closing Prayer",
          description: "End the Bible study with a powerful prayer session.",
          imageUrl: "/img/closing-prayer.jpg",
        },
      ],
    },
  ],
}

export const kipaimara = {
  name:'Matukio kati picha Kipaimara 2024',
  content: [
    {
      groupName: "Watumishi waliohudumu",
      content: [
        {
          title: "",
          description: "Ibada iliongozwa na mkuu wa jimbo",
          imageUrl: "/img/mkuuwajimbo2.jpg", // Optional image
          //videoUrl: "https://example.com/worship-video.mp4", // Optional video URL
        },
        {
          title: "Kwaya",
          description: "Parish worker...",
          videoUrl: "/videos/worthy.mp4", // Optional video URL
        },
        {
          title: "Wabarikiwa",
          description: "wakati wa picha kwa wabarikiwa",
          imageUrl: "/img/wabarikiwa.jpg",
        },
        {
          title: "Wabarikiwa",
          description: "wakati wa picha picha kwa wabarikiwa.",
          imageUrl: "/img/washarika.jpg",
          
        },
      ],
    },
    {
      groupName: "Youth Fellowship",
      content: [
        {
          title: "Youth Empowerment Talk",
          description: "Guest speaker shares insights on leadership and personal growth.",
          imageUrl: "/img/youth.jpg",
        
        },
        {
          title: "Praise and Worship",
          description: "A lively and energetic time of praise with the youth group.",
          imageUrl: "/img/youth-praise.jpg",
        },
        {
          title: "Group Activities",
          description: "Fun and engaging activities for youth to bond and grow in faith.",
          imageUrl: "/img/youth-activities.jpg",
        },
      ],
    },
    {
      groupName: "Bible Study",
      content: [
        {
          title: "Bible Study Session 1",
          description: "Deep dive into the teachings of the Bible and how they apply to our lives.",
          imageUrl: "/img/bible.jpg",
          
        },
        {
          title: "Group Discussion",
          description: "Small group discussions to better understand the scripture.",
          imageUrl: "/img/group-discussion.jpg",
        },
        {
          title: "Closing Prayer",
          description: "End the Bible study with a powerful prayer session.",
          imageUrl: "/img/closing-prayer.jpg",
        },
      ],
    },
  ],
}

export const efm = {
  name:'Kwaya ya Vijana walipotembelea EFM',
  content: [
    {
      groupName: "Kwaya studio",
      content: [
        {
          title: "Picha za pamoja",
          description: "Wanakwaya wakipiga picha za ukumbusho",
          imageUrl: "/img/worship1.jpg", // Optional image
          //videoUrl: "https://example.com/worship-video.mp4", // Optional video URL
        },
        {
          title: "Kwaya Live on Air",
          description: "Kwaya ikiimba live on air",
          videoUrl: "/videos/efm.mp4", // Optional video URL
        },
        {
          title: "Kuondoka",
          description: "Come together to pray for our community and church.",
          imageUrl: "/img/pray-church.jpg",
          
        },
      ],
    },
    {
      groupName: "Youth Fellowship",
      content: [
        {
          title: "Youth Empowerment Talk",
          description: "Guest speaker shares insights on leadership and personal growth.",
          imageUrl: "/img/youth.jpg",
        
        },
        {
          title: "Praise and Worship",
          description: "A lively and energetic time of praise with the youth group.",
          imageUrl: "/img/youth-praise.jpg",
        },
        {
          title: "Group Activities",
          description: "Fun and engaging activities for youth to bond and grow in faith.",
          imageUrl: "/img/youth-activities.jpg",
        },
      ],
    },
    {
      groupName: "Bible Study",
      content: [
        {
          title: "Bible Study Session 1",
          description: "Deep dive into the teachings of the Bible and how they apply to our lives.",
          imageUrl: "/img/bible.jpg",
          
        },
        {
          title: "Group Discussion",
          description: "Small group discussions to better understand the scripture.",
          imageUrl: "/img/group-discussion.jpg",
        },
        {
          title: "Closing Prayer",
          description: "End the Bible study with a powerful prayer session.",
          imageUrl: "/img/closing-prayer.jpg",
        },
      ],
    },
  ],
}
 




export const contentGroups = [
    {
      groupName: "Ibada zetu",
      content: [
        {
          title: "Kumuabudu Mungu wetu",
          description: "Join us for a powerful time of worship with the church choir.",
          imageUrl: "/img/worship.jpg", // Optional image
          //videoUrl: "https://example.com/worship-video.mp4", // Optional video URL
        },
        {
          title: "    Ujumbe wa Neno la Mungu",
          description: "Reflect on the sermon from our Sunday service.",
          imageUrl: "/img/mahubiri.jpg",
        },
        {
          title: "Maombi",
          description: "Come together to pray for our community and church.",
          imageUrl: "/img/pray-church.jpg",
         
        },
      ],
    },
    {
      groupName: "Kwaya",
      content: [
        {
          title: "Kwaya ya Umoja wa Vijana",
          description: "Guest speaker shares insights on leadership and personal growth.",
         
          videoUrl: "/videos/worthy.mp4",
        },
       
        {
          title: "Group Activities",
          description: "Fun and engaging activities for youth to bond and grow in faith.",
          imageUrl: "/img/youth.jpg",
        },
      ],
    },
    {
      groupName: "Bible Study",
      content: [
        {
          title: "Bible Study Session 1",
          description: "Deep dive into the teachings of the Bible and how they apply to our lives.",
          imageUrl: "/img/bible.jpg",
        
        },
        {
          title: "Group Discussion",
          description: "Small group discussions to better understand the scripture.",
          imageUrl: "/img/evangelism.jpg",
        },
        {
          title: "Closing Prayer",
          description: "End the Bible study with a powerful prayer session.",
          imageUrl: "/img/pray-church.jpg",
        },
      ],
    },
  ];


  

  

 export const content = [
  {
    groupName: "Ibada zetu",
    content: [
      {
        title: "Kumuabudu Mungu wetu",
        description: "Join us for a powerful time of worship with the church choir.",
        imageUrl: "/img/worship.jpg", // Optional image
        //videoUrl: "https://example.com/worship-video.mp4", // Optional video URL
      },
      {
        title: "    Ujumbe wa Neno la Mungu",
        description: "Reflect on the sermon from our Sunday service.",
        imageUrl: "/img/mahubiri.jpg",
      },
      {
        title: "Maombi",
        description: "Come together to pray for our community and church.",
        imageUrl: "/img/pray-church.jpg",
       
      },
    ],
  },
  {
    groupName: "Kwaya",
    content: [
      {
        title: "Kwaya ya Umoja wa Vijana",
        description: "Guest speaker shares insights on leadership and personal growth.",
       
        videoUrl: "/videos/efm.mp4",
      },
     
      {
        title: "Group Activities",
        description: "Fun and engaging activities for youth to bond and grow in faith.",
        imageUrl: "/img/youth.jpg",
      },
    ],
  },
  {
    groupName: "Bible Study",
    content: [
      {
        title: "Bible Study Session 1",
        description: "Deep dive into the teachings of the Bible and how they apply to our lives.",
        imageUrl: "/img/bible.jpg",
       
      },
      {
        title: "Group Discussion",
        description: "Small group discussions to better understand the scripture.",
        imageUrl: "/img/group-discussion.jpg",
      },
      {
        title: "Closing Prayer",
        description: "End the Bible study with a powerful prayer session.",
        imageUrl: "/img/pray-church.jpg",
      },
    ],
  },
 ]
  
 
  