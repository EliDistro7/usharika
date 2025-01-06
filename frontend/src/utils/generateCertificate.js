import jsPDF from "jspdf";

const addWatermark = (doc, text) => {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(50);
  doc.setTextColor(200, 200, 200); // Light gray for watermark
  doc.text(text, 148.5, 105, {
    align: "center",
    angle: -30, // Rotate text for a diagonal watermark
  });
};

const addArtisticBackground = (doc) => {
  // Artistic background with a central light-dark blue circle
  doc.setFillColor(240, 240, 240); // Light gray fill for the page
  doc.rect(0, 0, 297, 210, "F"); // Entire page background

  // Central decorative circle
  doc.setFillColor(180, 200, 230); // Light blue (Changed to blue as per your request)
  doc.circle(148.5, 105, 100, "F"); // Main circle

  doc.setFillColor(120, 140, 200); // Slightly darker blue
  doc.circle(148.5, 105, 90, "F"); // Inner circle
};

const addClipArtBorder = (doc) => {
  // Example of simple decorative clip art-style border (could be small patterns, shapes, etc.)
  const borderSize = 10;
  for (let x = 0; x <= 297; x += borderSize) {
    doc.setFillColor(200, 200, 200); // Light gray
    doc.circle(x, 0, borderSize, "F");
    doc.circle(x, 210, borderSize, "F");
  }
  for (let y = 0; y <= 210; y += borderSize) {
    doc.setFillColor(200, 200, 200); // Light gray
    doc.circle(0, y, borderSize, "F");
    doc.circle(297, y, borderSize, "F");
  }
};

const addTextContent = (doc, details) => {
  const { recipientName, points, groupName, issuer, date } = details;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(0, 51, 102); // Dark blue
  doc.text("Cheti cha Ubora", 148.5, 40, { align: "center" });

  // Recipient's Name
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("Kinatolewa kwa", 148.5, 60, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.text(recipientName, 148.5, 80, { align: "center" });

  // Reason
  doc.setFont("helvetica", "italic");
  doc.setFontSize(16);
  doc.text(`Kutambua mchango wako wa kipekee katika ${groupName}.`, 148.5, 100, { align: "center" });
  doc.text("Umeleta baraka na kuboresha huduma yetu kwa bidii yako.", 148.5, 110, { align: "center" });

  // Points and Group
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`Alama: ${points}`, 148.5, 130, { align: "center" });
  doc.text(`Huduma: ${groupName}`, 148.5, 140, { align: "center" });

  // Issuer and Date
  doc.text(`Imetolewa na: ${issuer}`, 148.5, 160, { align: "center" });
  doc.text(`Tarehe: ${date}`, 148.5, 170, { align: "center" });
};

const addSignatures = (doc) => {
  // Provide areas for leader signatures
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // First leader's signature area
  doc.text("_____________________________", 60, 190);
  doc.text("Katibu (Sahihi)", 60, 200);

  // Second leader's signature area
  doc.text("_____________________________", 210, 190);
  doc.text("Mwenyekiti (Sahihi)", 210, 200);
};

const generateCertificate = (recipientDetails) => {
  const { recipientName, groupName, points, issuer, date } = recipientDetails;

  const doc = new jsPDF("landscape"); // Landscape layout for the certificate

  // Add artistic background
  addArtisticBackground(doc);

  // Add clip art-style borders
  addClipArtBorder(doc);

  // Add watermark with group name
  addWatermark(doc, groupName);

  // Add text content
  addTextContent(doc, recipientDetails);

  // Add signature areas
  addSignatures(doc);

  // Save the document
  doc.save(`${recipientName}_cheti.pdf`);
};

export default generateCertificate;
