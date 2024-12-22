const ProgramsServices = () => (
  <div className="container py-5 ">
    {/* Header */}
    <h2 className="text-center text-primary fw-bold mb-5">
      Mafunzo na Huduma
    </h2>

    {/* Weekly Programs */}
    <div className="row mb-5">
      <div className="col-lg-6 mb-4">
        <h4 className="text-dark fw-bold mb-3">Ratiba ya Mafunzo na Ibada</h4>
        <ul className="list-group shadow-sm">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Ibada ya Jumapili:</strong>
            <span>9:00 AM</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Mafunzo ya Biblia:</strong>
            <span>Jumatano, 6:00 PM</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Huduma ya Vijana:</strong>
            <span>Jumamosi, 3:00 PM</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Maombi ya Usiku:</strong>
            <span>Ijumaa ya Kwanza, 9:00 PM</span>
          </li>
        </ul>
      </div>

      {/* Office Hours */}
      <div className="col-lg-6">
        <h4 className="text-dark fw-bold mb-3">
          Ratiba ya Ofisi ya Mchungaji Kiongozi
        </h4>
        <ul className="list-group shadow-sm">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Jumatatu - Jumatano:</strong>
            <span>10:00 AM - 4:00 PM</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Alhamisi:</strong>
            <span>2:00 PM - 6:00 PM</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Jumapili:</strong>
            <span>Baada ya ibada</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Ministries */}
    <div>
      <h4 className="text-dark fw-bold mb-4 text-center">
        Huduma Zinazopatikana Kanisani
      </h4>
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-white">
            <h5 className="text-primary">Huduma ya Wanawake</h5>
            <p className="text-black">Kukuza wanawake katika imani na huduma.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-white">
            <h5 className="text-primary">Huduma ya Vijana</h5>
            <p className="text-black">Kuwasaidia vijana kukua kiroho na kijamii.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-white">
            <h5 className="text-primary">Huduma ya Watoto</h5>
            <p className="text-black">Kuwafundisha watoto njia za Mungu.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-white">
            <h5 className="text-primary">Kwaya na Muziki</h5>
            <p className="text-black">Kuhudumu kupitia nyimbo za sifa.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-white">
            <h5 className="text-primary">Huduma ya Uinjilisti</h5>
            <p className="text-black">
              Kupeleka injili kwa jamii pana.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-white">
            <h5 className="text-primary">Huduma ya Msaada</h5>
            <p className="text-black">
              Kusaidia wenye uhitaji kwa rasilimali mbalimbali.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProgramsServices;
