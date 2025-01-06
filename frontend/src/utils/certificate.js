import jsPDF from "jspdf";

// Function to add a gradient background (with shading pattern)
const addGradientBackground = (doc) => {
  doc.advancedAPI((pdf) => {
    const gradientKey = "line-gradient";
    // Define the gradient (axial for horizontal gradient)
    pdf.addShadingPattern(
      gradientKey,
      new ShadingPattern(
        "axial", // Type of gradient (axial or radial)
        [0, 0, 297, 0], // Gradient from left to right (full width of A4 page)
        [
          { offset: 0, color: [0, 93, 255] },   // Start color (blue)
          { offset: 1, color: [33, 221, 255] }  // End color (lighter blue)
        ]
      )
    );

    // Apply the gradient to the full page as a rectangle (A4 is 297mm wide, 210mm tall)
    pdf.rect(0, 0, 297, 210).fill({
      key: gradientKey,
      matrix: pdf.internal.Matrix(0, 0, 0, 0, 0, 0)  // Use internal.Matrix for the transformation matrix
    });
  });
};


// Function to add watermark
const addWatermark = (doc, text) => {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(30);
  doc.setTextColor(190, 102, 240); // Light gray for watermark
  doc.text("KKKT Usharika wa Yombo", 148.5, 85, {
    align: "center",
    angle: -30, // Rotate text for a diagonal watermark
  });
};

// Function to add artistic background with circles
const addArtisticBackground = (doc) => {
  doc.setFillColor(240, 240, 240); // Light gray background
  doc.rect(0, 0, 297, 210, "F"); // Entire page background

  // Central decorative circle (light blue)
  doc.setFillColor(190, 62, 250); // Light blue
  doc.circle(148.5, 105, 100, "F"); // Outer circle

  // Slightly darker blue inner circle
  doc.setFillColor(160, 32, 240); // Slightly darker blue
  doc.circle(148.5, 105, 90, "F"); // Inner circle
};

// Function to add decorative clip art borders
const addClipArtBorder = (doc) => {
  const borderSize = 10;
  
  // Top and bottom borders
  for (let x = 0; x <= 297; x += borderSize) {
    doc.setFillColor(160, 32, 240); // Light gray color
    doc.circle(x, 0, borderSize, "F"); // Top border
    doc.circle(x, 210, borderSize, "F"); // Bottom border
  }

  // Left and right borders
  for (let y = 0; y <= 210; y += borderSize) {
    doc.setFillColor(160, 32, 240); // Light gray
    doc.circle(0, y, borderSize, "F"); // Left border
    doc.circle(297, y, borderSize, "F"); // Right border
  }
};

// Function to add text content
const addTextContent = (doc, details) => {
  const { recipientName, points, groupName, issuer, dateRange } = details;

  // Title text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.setTextColor(255, 255, 255); // Gold for the title
  doc.text("Cheti cha Umahiri", 148.5, 40, { align: "center" });
  doc.setFontSize(30);
  doc.setTextColor(255, 223, 0); // Gold for the titl
  doc.text("Kutunza Muda", 148.5, 52, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255); // Gold for the titl
  doc.text(` ${dateRange.startDate} - ${dateRange.endDate}`, 148.5, 62, { align: "center" });
  // Recipient's name text
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255); // White for main text
  doc.text("Kinatolewa kwa", 148.5, 80, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 223, 0); // Gold for the title
  doc.text(recipientName, 148.5, 92, { align: "center" });

  // Reason for award
  doc.setFont("helvetica", "italic");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(`Kutambua jitihada zako za kipekee katika kufika `, 148.5, 106, { align: "center" });
  doc.text(`kwa wakati kwenye vipindi vya ${groupName}.`, 148.5, 116, { align: "center" });
  doc.text("Umeleta baraka na kuboresha huduma yetu kwa bidii yako.", 148.5, 126, { align: "center" });

  // Points and group service details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 223, 0); // Gold for the titl
  doc.text(`Alama: ${points}`, 148.5, 144, { align: "center" });
  doc.setTextColor(255, 255, 255); // Gold for the titl
  doc.setFontSize(14);
  //doc.text(`Huduma: ${groupName}`, 148.5, 146, { align: "center" });

  // Issuer and date range
 // doc.text(`Imetolewa na: Uongozi wa ${issuer}`, 148.5, 6, { align: "center" });
  
};

// Function to add signature areas
const addSignatures = (doc, groupName) => {
  doc.setTextColor(0, 0, 0); // Light gray for watermark
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Signature for first leader (e.g., secretary)
  doc.text("_____________________________", 30, 190);
  doc.text("Mchungaji (Sahihi)", 30, 196);

  // Signature for second leader (e.g., chairman)
  doc.text("_____________________________", 210, 190);

  const textToDisplay = groupName.toLowerCase().startsWith("kwaya") || groupName.toLowerCase().startsWith("praise")
    ? "Mwalimu (Sahihi)"
    : "Mwenyekiti";

  doc.text(textToDisplay, 210, 196);
};

// Function to generate the certificate
const generateCertificate = (recipientDetails) => {
  const { recipientName, groupName, points, issuer, date } = recipientDetails;

  const doc = new jsPDF("landscape"); // Landscape layout for the certificate

  // Add gradient background
 // addGradientBackground(doc);

  // Add artistic background with circles
  addArtisticBackground(doc);

  // Add clip art-style borders
  addClipArtBorder(doc);

  // Add watermark with group name
  addWatermark(doc, groupName);

  // Add text content (title, recipient's name, etc.)
  addTextContent(doc, recipientDetails);

  // Add signature areas
  addSignatures(doc, groupName);

  // Save the document
  doc.save(`${recipientName}_cheti.pdf`);
};

export default generateCertificate;
