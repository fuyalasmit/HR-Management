module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "employee",
    {
      empId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preferredName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      maritalStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hireDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      salary: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      managerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employmentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      compensationType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      compensation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      effectiveDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      weeklyHours: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      photo: {
        type: Sequelize.BLOB,
        allowNull: true,
      },
      officeLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      teamId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      position: {
        type: Sequelize.ENUM(
          "Professor",
          "Associate Professor",
          "Assistant Professor",
          "Lecturer",
          "Senior Instructor",
          "Instructor",
          "Assistant Instructor", 
          "Staff"
        ),
        allowNull: false,
        defaultValue: "Staff",
      },
      post: {
        type: Sequelize.ENUM(
          "Morning Coordinator",
          "HOD",
          "DHOD",
          "Coordinator",
          "Assistant Dean (IOE)",
          "Assistant Director (CARD)",
          "Director (CIT)",
          "IC Chair",
          "Coordinator (MsDSA)",
          "Coordinator (MsCSKE)",
          "Coordinator (MsICE)",
          "Coordinator (MsNCS)"
        ),
        allowNull: true,
        defaultValue: null,
      },
      emergencyContactName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emergencyContactRelationship: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emergencyContactPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      streetAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unitSuite: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stateProvince: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postalZipCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      terminationReason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      terminationNote: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      autoDeleteAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completedOnboardingAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      degrees: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      fieldOfInterest: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contractExpiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
    }
  );
};
