import jsPDF from "jspdf";

// Import the select options for consistency
const selectOptions = require("../../assets/employee-form-select-options.json");

/**
 * Generates a downloadable PDF form with all employee registration fields
 * This form can be printed and filled out manually, then data can be entered into the app later
 */
export const generateEmployeeFormPDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;
  let yPos = margin;

  // Helper function to add text with automatic page break
  const addText = (text, x, y, options = {}) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      y = yPos;
    }
    doc.text(text, x, y, options);
    return y;
  };

  // Helper function to add a field with label and line
  const addField = (label, required = false, width = 80) => {
    if (yPos > pageHeight - margin - 10) {
      doc.addPage();
      yPos = margin;
    }

    const requiredText = required ? "*" : "";
    doc.setFontSize(10);
    doc.text(`${label}${requiredText}`, margin, yPos);

    // Draw a line for writing
    const lineY = yPos + 3;
    doc.line(margin, lineY, margin + width, lineY);

    yPos += lineHeight * 1.5;
    return yPos;
  };

  // Helper function to add two fields side by side
  const addTwoFields = (label1, label2, required1 = false, required2 = false) => {
    if (yPos > pageHeight - margin - 10) {
      doc.addPage();
      yPos = margin;
    }

    const fieldWidth = (pageWidth - margin * 2 - 10) / 2;

    doc.setFontSize(10);
    doc.text(`${label1}${required1 ? "*" : ""}`, margin, yPos);
    doc.text(`${label2}${required2 ? "*" : ""}`, margin + fieldWidth + 10, yPos);

    // Draw lines for writing
    const lineY = yPos + 3;
    doc.line(margin, lineY, margin + fieldWidth, lineY);
    doc.line(margin + fieldWidth + 10, lineY, pageWidth - margin, lineY);

    yPos += lineHeight * 1.5;
    return yPos;
  };

  // Helper function to add a section header
  const addSectionHeader = (title) => {
    if (yPos > pageHeight - margin - 15) {
      doc.addPage();
      yPos = margin;
    }

    yPos += 5;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(title, margin, yPos);
    yPos += lineHeight * 1.2;
    doc.setFont(undefined, "normal");
  };

  // Helper function to add checkbox options
  const addCheckboxOptions = (label, options, required = false) => {
    if (yPos > pageHeight - margin - 20) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(10);
    doc.text(`${label}${required ? "*" : ""}`, margin, yPos);
    yPos += lineHeight;

    options.forEach((option) => {
      if (option && option.trim() !== "") {
        // Draw checkbox
        doc.rect(margin + 5, yPos - 3, 3, 3);
        doc.text(option, margin + 12, yPos);
        yPos += lineHeight * 0.8;
      }
    });

    yPos += lineHeight * 0.5;
  };

  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  yPos = addText("Employee Registration Form", pageWidth / 2, yPos, { align: "center" });
  yPos += lineHeight * 2;

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  yPos = addText("Please fill out all required fields marked with (*)", pageWidth / 2, yPos, { align: "center" });
  yPos += lineHeight * 2;

  // Personal Information Section
  addSectionHeader("Personal Information");

  addTwoFields("First name", "Last name", true, true);
  addField("Preferred name");
  addCheckboxOptions("Gender", selectOptions.gender, true);
  addField("Birth date (MM/DD/YYYY)", true);
  addField("Nationality", true);
  addCheckboxOptions("Marital status", selectOptions.maritalStatus, true);

  // Photo section
  yPos += 5;
  doc.text("Photo", margin, yPos);
  yPos += 5;
  doc.rect(margin, yPos, 60, 40);
  doc.text("Attach photo here", margin + 5, yPos + 20);
  doc.text("(SVG, PNG, JPG or GIF, max. 800x400px)", margin + 5, yPos + 25);
  yPos += 50;

  // Social Profiles Section
  addSectionHeader("Social Profiles");
  addField("Twitter (twitter.com/)");
  addField("Facebook (facebook.com/)");
  addField("LinkedIn (linkedin.com/in/)");

  // Education Section
  addSectionHeader("Education");

  // Degree fields
  for (let i = 1; i <= 3; i++) {
    doc.text(`Degree ${i}`, margin, yPos);
    yPos += lineHeight;
    addCheckboxOptions("Degree Type", selectOptions.degreeTypes);
    addField("Field of Study (e.g., Computer Science, Business Administration)");
  }

  // Field of Interest
  yPos += 5;
  doc.text("Field of Interest (Optional)", margin, yPos);
  yPos += 5;
  doc.text("Describe your overall areas of interest, research focus, or career aspirations:", margin, yPos);
  yPos += 5;
  // Multiple lines for writing
  for (let i = 0; i < 4; i++) {
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += lineHeight;
  }

  // Check if we need a new page for contact information
  if (yPos > pageHeight - margin - 100) {
    doc.addPage();
    yPos = margin;
  }

  // Contact Information Section
  addSectionHeader("Contact Information");

  addTwoFields("Mobile", "Work email", true, true);
  addTwoFields("Address line 1", "Address line 2", true, false);
  addTwoFields("Country", "State (if applicable)", true, false);
  addTwoFields("City", "Postal/zip code", true, false);
  addTwoFields("Emergency contact name", "Emergency contact relationship", true, true);
  addField("Emergency contact phone", true);

  // Job Information Section
  addSectionHeader("Job Information");

  addTwoFields("Hire date (MM/DD/YYYY)", "Effective date (MM/DD/YYYY)", true, false);
  addCheckboxOptions("Academic Position", selectOptions.position, true);
  addCheckboxOptions("Post", selectOptions.post);
  addField("Department", true);
  addCheckboxOptions("Employment type", selectOptions.employmentType, true);
  addField("Salary", true);

  // Contract expiry date (conditional)
  yPos += 5;
  doc.text('Contract expiry date (MM/DD/YYYY) - Only if Employment type is "Contract employment"', margin, yPos);
  yPos += 5;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += lineHeight * 2;

  // Footer with instructions
  if (yPos > pageHeight - margin - 30) {
    doc.addPage();
    yPos = margin;
  }

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("Instructions:", margin, yPos);
  yPos += lineHeight;
  doc.setFont(undefined, "normal");
  doc.text("1. Please fill out all required fields marked with (*)", margin, yPos);
  yPos += lineHeight;
  doc.text("2. For checkbox fields, please mark the appropriate option with ✓", margin, yPos);
  yPos += lineHeight;
  doc.text("3. Use clear, legible handwriting", margin, yPos);
  yPos += lineHeight;
  doc.text("4. Return completed form to HR for data entry into the system", margin, yPos);

  // Generate filename with current date
  const currentDate = new Date().toISOString().split("T")[0];
  const filename = `Employee_Registration_Form_${currentDate}.pdf`;

  // Save the PDF
  doc.save(filename);
};

export default generateEmployeeFormPDF;
