import { useContext, useState, useEffect } from "react";
import { Box } from "@mui/material";
import PeopleDetails from "./PeopleDetails";
import EmployeeForm from "../components/PeopleComponents/EmployeeForm";
import EmployeeSnackbar from "../components/PeopleComponents/Snackbar";
import ActionButtonEmployee from "../components/PeopleComponents/EndEmployment";
import StateContext from "../context/StateContext";
import { useLocation } from "react-router-dom";
const api = require("../assets/FetchServices");

const getHomePath = (location) => {
  const fullUrl = window.location.href;
  const relativeUrl = location.pathname;
  if (fullUrl === relativeUrl) {
    return fullUrl;
  }
  return fullUrl.substring(0, fullUrl.indexOf(relativeUrl));
};

/**
 * This function enables users to view employees' details. Only the administrator can view all the details.
 * @param {*} props
 * @returns React component
 */
function PeopleHome() {
  const stateContext = useContext(StateContext);
  const location = useLocation();
  const [viewOnly, setViewOnly] = useState(true); // view by default
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [alert, setAlert] = useState({ show: false });
  const [openEndEmployment, setOpenEndEmployment] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  // Add useEffect to track state changes
  useEffect(() => {
    console.log("📊 State change - viewOnly:", viewOnly);
  }, [viewOnly]);

  useEffect(() => {
    console.log("📊 State change - selectedEmployee:", selectedEmployee?.empId, selectedEmployee?.firstName);
  }, [selectedEmployee]);

  useEffect(() => {
    console.log("📊 State change - openEndEmployment:", openEndEmployment);
  }, [openEndEmployment]);

  const handleEdit = async (data) => {
    console.log("📝 PeopleHome handleEdit called with data:", data?.empId, data?.firstName, data?.lastName);
    
    if (!data) {
      console.error("❌ handleEdit called with null/undefined data");
      return;
    }
    
    try {
      console.log("🔄 Clearing cached employee data and fetching fresh data...");
      // Clear cached employee data to force fresh fetch
      stateContext.updateState("pdEmployees", null);
      stateContext.updateState("pdMyTeam", null);
      
      // Force fresh data fetch for editing to avoid stale cache issues
      console.log("🌐 Making API call to fetch employee:", data.empId);
      const freshEmployeeData = await api.employee.fetchOne(data.empId);
      console.log("🌐 API response:", freshEmployeeData ? "Success" : "Failed", freshEmployeeData);
      
      if (freshEmployeeData) {
        console.log("✅ Fresh employee data fetched successfully, switching to edit mode");
        console.log("🔍 Current viewOnly state before change:", viewOnly);
        console.log("🔍 Current selectedEmployee before change:", selectedEmployee?.empId);
        setViewOnly(false);
        setSelectedEmployee({ ...freshEmployeeData });
        console.log("🔍 State changes called - viewOnly set to false, selectedEmployee set to:", freshEmployeeData.empId);
        
        // Force a re-render by using a setTimeout
        setTimeout(() => {
          console.log("⏰ After timeout - viewOnly:", viewOnly, "selectedEmployee:", selectedEmployee?.empId);
        }, 100);
      } else {
        console.warn("⚠️ Could not fetch fresh data, using cached data");
        console.log("🔍 Current viewOnly state before change:", viewOnly);
        setViewOnly(false);
        setSelectedEmployee({ ...data });
        console.log("🔍 State changes called - viewOnly set to false, selectedEmployee set to:", data.empId);
      }
    } catch (error) {
      console.error("❌ Error fetching fresh employee data:", error);
      console.log("🔄 Falling back to cached data");
      console.log("🔍 Current viewOnly state before change:", viewOnly);
      setViewOnly(false);
      setSelectedEmployee({ ...data });
      console.log("🔍 State changes called - viewOnly set to false, selectedEmployee set to:", data.empId);
    }
  };

  const handleTermination = (data) => {
    console.log("🛑 PeopleHome handleTermination called with data:", data?.empId, data?.firstName, data?.lastName);
    
    // Clear cached data to ensure fresh data on return
    console.log("🔄 Clearing cached data for termination");
    stateContext.updateState("pdEmployees", null);
    stateContext.updateState("pdMyTeam", null);
    
    console.log("🔍 Current openEndEmployment state before change:", openEndEmployment);
    console.log("🔍 Current selectedEmployee before change:", selectedEmployee?.empId);
    console.log("✅ Opening end employment dialog");
    setOpenEndEmployment(true);
    setSelectedEmployee(data);
    console.log("🔍 State changes called - openEndEmployment set to true, selectedEmployee set to:", data?.empId);
  };

  const handleSurvey = async (data) => {
    if(!data || !data.empId){
      return;
    }
    const params =  { 
      empId: data.empId, 
      email: data.email, 
      frontendUrl: `${getHomePath(location)}/`} 
      await api.offboarding.createOne(params);
    setLinkSent(true); // if the operation is successful
    setTimeout(() => {
      setLinkSent(false); // reset the variable
    }, 5000);
  };

  const handleAddNewEmployee = () => {
    setViewOnly(false);
    setSelectedEmployee(null);
  };

  const handleSave = () => {
    setViewOnly(true);
    const alertData = {
      show: true,
      message: selectedEmployee
        ? `Record successfully updated.`
        : `Employee successfully added.`,
    };
    setAlert(alertData);
    stateContext.updateState("pdEmployees", null); // Force reload of data
  };
  
  // Add render logging to track what's being displayed
  console.log("🖥️ PeopleHome render - viewOnly:", viewOnly, "openEndEmployment:", openEndEmployment, "selectedEmployee:", selectedEmployee?.empId);
  
  return (
    <Box>
      {linkSent && (
        <EmployeeSnackbar
          isOpen={true}
          message={"Offboarding link has been sent to the user email"}
        />
      )}
      {openEndEmployment && (
        <>
          {console.log("🖥️ Rendering ActionButtonEmployee dialog")}
          <ActionButtonEmployee
            empId={selectedEmployee && selectedEmployee.empId}
            open={openEndEmployment}
            onClose={setOpenEndEmployment}
          />
        </>
      )}
      {viewOnly && (
        <>
          {console.log("🖥️ Rendering PeopleDetails (view only mode)")}
          <Box>
            <EmployeeSnackbar isOpen={alert.show} message={alert.message} />
            <PeopleDetails
              handleSurvey={handleSurvey}
              handleTermination={handleTermination}
              handleEdit={handleEdit}
              handleAddNewEmployee={handleAddNewEmployee}
            />
          </Box>
        </>
      )}
      {!viewOnly && (
        <>
          {console.log("🖥️ Rendering EmployeeForm (edit mode)")}
          <EmployeeForm
            employee={selectedEmployee}
            onDiscard={() => {
              setViewOnly(true);
              setAlert({
                show: false,
                message: "",
              });
            }}
            onSave={handleSave}
          />
        </>
      )}
    </Box>
  );
}

export default PeopleHome;
