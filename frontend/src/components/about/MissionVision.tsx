const MissionVision = () => (
    <div className="container py-5 videobg">
      <h2 className="text-center text-primary fw-bold mb-4">Maono na Dhamira</h2>
      <div className="row align-items-center">
        {/* Image Placeholder */}
        <div className="col-md-4 text-center">
          <img
            src="/img/mchungaji.jpg"
            alt="Mchungaji Kiongozi"
            className="img-fluid rounded-circle shadow"
          />
          <h5 className="mt-3">Rev. John Katabazi</h5>
          <p className="text-muted">Mchungaji Kiongozi</p>
        </div>
  
        {/* Mission and Vision Text */}
        <div className="col-md-8">
          <p className="text-dark mb-3">
            <strong>Maono:</strong> Kuwa taa ya nuru kwa ulimwengu kupitia neno la Mungu.
          </p>
          <p className="text-dark">
            <strong>Dhamira:</strong> Kumtumikia Mungu na wanadamu kwa upendo, huduma, na mshikamano.
          </p>
        </div>
      </div>
  
      {/* Button */}
      <div className="text-center mt-4">
        <a href="/uongozi" className="btn btn-primary px-4 py-2 btn-border-radius">
          Ujue Uongozi Wetu
        </a>
      </div>
    </div>
  );
  
  export default MissionVision;
  