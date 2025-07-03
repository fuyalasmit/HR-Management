const db = require("../../models");
require("dotenv").config();
const message = require("../../constants/messages.json");
const EmailService = require("../helper/emailServices");

// Send mass email to multiple recipients
exports.sendMassEmail = async (req, res) => {
  try {
    const { title, content, recipients, recipientType } = req.body;

    if (!title || !content || !recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and recipients are required."
      });
    }

    // Fetch recipient details
    const employees = await db.employee.findAll({
      attributes: ["empId", "firstName", "lastName", "email"],
      include: [
        {
          model: db.department,
          attributes: ["departmentName"],
        },
      ],
      where: { empId: recipients },
      order: ["firstName", "lastName"],
    });

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid recipients found."
      });
    }

    // Get company information
    const company = await db.company.findOne({
      attributes: ["companyName"],
    });

    const emailService = new EmailService();
    const sentEmails = [];
    const failedEmails = [];

    // Send emails to all recipients
    for (let employee of employees) {
      try {
        const context = {
          companyName: company ? company.companyName : "BlueWave Labs",
          emailTitle: title,
          emailContent: content,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          email: process.env.EMAIL,
          copyrightYear: new Date().getFullYear(),
        };

        const messageId = await emailService.buildAndSendEmail(
          "mass_email", // Template name - matches the file name
          context,
          employee.email,
          title
        );

        sentEmails.push({
          empId: employee.empId,
          email: employee.email,
          messageId: messageId,
          status: "sent"
        });

        console.log(`Email sent to ${employee.email}! Message ID: ${messageId}`);
      } catch (error) {
        console.error(`Failed to send email to ${employee.email}:`, error);
        failedEmails.push({
          empId: employee.empId,
          email: employee.email,
          error: error.message,
          status: "failed"
        });
      }
    }

    // Save email history to database
    try {
      await db.massEmail.create({
        title: title,
        content: content,
        recipientType: recipientType,
        recipientCount: employees.length,
        sentCount: sentEmails.length,
        failedCount: failedEmails.length,
        sentDate: new Date(),
        status: failedEmails.length === 0 ? "sent" : "partial"
      });
    } catch (dbError) {
      console.error("Error saving email history:", dbError);
    }

    res.status(200).json({
      success: true,
      message: "Mass email processing completed",
      data: {
        totalRecipients: employees.length,
        sentCount: sentEmails.length,
        failedCount: failedEmails.length,
        sentEmails: sentEmails,
        failedEmails: failedEmails
      }
    });

  } catch (error) {
    console.error("Error sending mass email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Fetch email history
exports.fetchEmailHistory = async (req, res) => {
  try {
    const emailHistory = await db.massEmail.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["sentDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: emailHistory
    });
  } catch (error) {
    console.error("Error fetching email history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Fetch specific email details
exports.fetchEmailDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const emailDetails = await db.massEmail.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!emailDetails) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    res.status(200).json({
      success: true,
      data: emailDetails
    });
  } catch (error) {
    console.error("Error fetching email details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
