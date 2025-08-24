import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AttendancePage from '../pages/admin/attendance/AttendancePage';
import AuditTrailsPage from '../pages/admin/auditTrails/AuditTrailsPage';
import DashboardPage from '../pages/admin/dashboard/DashboardPage';
import EmployeesPage from '../pages/admin/employee/EmployeesPage';
import GuardTour from '../pages/admin/guardTour/GuardTour';
import IncidentTypePage from '../pages/admin/incident/incidentPage';
import OccurencePage from '../pages/admin/occurence/OccurencePage';
import ReportPage from '../pages/admin/report/ReportPage';
import SettingsAttendancePage from '../pages/admin/settings/attendance/SettingsAttendancePage';
import ClientInfoPage from '../pages/admin/settings/client/ClientInfoPage';
import EmployeeDocumentPage from '../pages/admin/settings/employeeDocument/EmployeeDocumentPage';
import IncidentPageMaster from '../pages/admin/settings/incident/IncidentPage';
import OccurrenceCatgPage from '../pages/admin/settings/occurrenceCatg/OccurrenceCatgPage';
import ProfilePage from '../pages/admin/settings/profile/ProfilePage';
import RolesPage from '../pages/admin/settings/roles/RolesPage';
import SopDocumentPage from '../pages/admin/settings/sop-document/SopDocumentPage';
import AllocationPage from '../pages/admin/site/AllocationPage';
import MapPage from '../pages/admin/site/MapPage';
import Pointers from '../pages/admin/site/Pointers';
import RoutePage from '../pages/admin/site/RoutePage';
import SitesPage from '../pages/admin/site/SitePage';
import LoginPage from '../pages/auth/LoginPage';
import Attendance from '../pages/mobile/Attendance/Attendance';
import Checkin from '../pages/mobile/Attendance/Checkin';
import ClockingPage from '../pages/mobile/Clocking/Clocking';
import ScanClocking from '../pages/mobile/Clocking/ScanClocking';
import Contact from '../pages/mobile/Contact/Contact';
import EmployeeDocument from '../pages/mobile/EmployeDocument/EmployeeDocument';
import GuardChoice from '../pages/mobile/GuardTour/GuardChoice';
import GuardScan from '../pages/mobile/GuardTour/GuardScan';
import GuardSubmit from '../pages/mobile/GuardTour/GuardSubmit';
import GuardTourPage from '../pages/mobile/GuardTour/GuardTourPage';
import Selection from '../pages/mobile/GuardTour/Selection';
import HomePage from '../pages/mobile/Home/HomePage';
import History from '../pages/mobile/Incident/History';
import Incident from '../pages/mobile/Incident/Incident';
import Report from '../pages/mobile/Incident/Report';
import Leaves from '../pages/mobile/Leaves/Leaves';
import RequestLeaves from '../pages/mobile/Leaves/RequestLeaves';
import EditOccurance from '../pages/mobile/Occurrence/EditOccurance';
import HistoryOccurance from '../pages/mobile/Occurrence/HistoryOccurance';
import Occurence from '../pages/mobile/Occurrence/Occurence';
import ReportOccurance from '../pages/mobile/Occurrence/ReportOccurance';
import ChangePassword from '../pages/mobile/Settings/ChangePassword';
import Profile from '../pages/mobile/Settings/Profile';
import Settings from '../pages/mobile/Settings/Settings';
import SopDocument from '../pages/mobile/SopDocument/SopDocument';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route path='/auth/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/dashboard/guard-tours' element={<GuardTour />} />
                <Route path='/dashboard/e-occurrences' element={<OccurencePage />} />
                <Route path='/dashboard/attendances' element={<AttendancePage />} />
                <Route path='/dashboard/sites' element={<SitesPage />} />
                <Route path='/dashboard/sites/map' element={<MapPage />} />
                <Route path='/dashboard/sites/allocation' element={<AllocationPage />} />
                <Route path='/dashboard/sites/routes' element={<RoutePage />} />
                <Route path='/dashboard/sites/routes/pointers' element={<Pointers />} />
                <Route path='/dashboard/reports' element={<ReportPage />} />
                <Route path='/dashboard/incidents' element={<IncidentTypePage />} />
                <Route path='/dashboard/employees' element={<EmployeesPage />} />
                <Route path='/dashboard/audit-trails' element={<AuditTrailsPage />} />
                <Route path='/dashboard/settings/attendance' element={<SettingsAttendancePage />} />
                <Route path='/dashboard/settings/client-info' element={<ClientInfoPage />} />
                <Route path='/dashboard/settings/employee-document' element={<EmployeeDocumentPage />} />
                <Route path='/dashboard/settings/incident' element={<IncidentPageMaster />} />
                <Route path='/dashboard/settings/occurrence-catg' element={<OccurrenceCatgPage />} />
                <Route path='/dashboard/settings/roles' element={<RolesPage />} />
                <Route path='/dashboard/settings/sop-document' element={<SopDocumentPage />} />
                <Route path='/dashboard/settings/profile' element={<ProfilePage />} />

                <Route path='/user' element={<HomePage />} />
                <Route path='/user/guard-tour' element={<GuardTourPage />} />
                <Route path='/user/guard-tour/selection' element={<Selection />} />
                <Route path='/user/guard-tour/selection/scan' element={<GuardScan />} />
                <Route path='/user/guard-tour/selection/scan/choice' element={<GuardChoice />} />
                <Route path='/user/guard-tour/selection/scan/choice/submit' element={<GuardSubmit />} />
                <Route path='/user/employee-document' element={<EmployeeDocument />} />
                <Route path='/user/attendance' element={<Attendance />} />
                <Route path='/user/attendance/checkin/:id' element={<Checkin />} />
                <Route path='/user/contact' element={<Contact />} />
                <Route path='/user/sop-document' element={<SopDocument />} />
                <Route path='/user/clocking' element={<ClockingPage />} />
                <Route path='/user/clocking/scan' element={<ScanClocking />} />
                <Route path='/user/e-occurence' element={<Occurence />} />
                <Route path='/user/e-occurence/report' element={<ReportOccurance />} />
                <Route path='/user/e-occurence/report/edit' element={<EditOccurance />} />
                <Route path='/user/e-occurence/history' element={<HistoryOccurance />} />
                <Route path='/user/incident' element={<Incident />} />
                <Route path='/user/incident/report' element={<Report />} />
                <Route path='/user/incident/history' element={<History />} />
                <Route path='/user/leaves' element={<Leaves />} />
                <Route path='/user/leaves/request' element={<RequestLeaves />} />
                <Route path='/user/settings' element={<Settings />} />
                <Route path='/user/settings/profile' element={<Profile />} />
                <Route path='/user/settings/change-password' element={<ChangePassword />} />

            </Routes>
        </Router>
    )
}

export default AppRoutes