import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/admin/dashboard/DashboardPage';
import AuditTrailsPage from '../pages/admin/auditTrails/AuditTrailsPage';
import EmployeesPage from '../pages/admin/employee/EmployeesPage';
import IncidentTypePage from '../pages/admin/incident/incidentPage';
import ReportPage from '../pages/admin/report/ReportPage';
import SitesPage from '../pages/admin/site/SitePage';
import MapPage from '../pages/admin/site/MapPage';
import AllocationPage from '../pages/admin/site/AllocationPage';
import RoutePage from '../pages/admin/site/RoutePage';
import Pointers from '../pages/admin/site/Pointers';
import ProfilePage from '../pages/admin/settings/profile/ProfilePage';
import SettingsAttendancePage from '../pages/admin/settings/attendance/SettingsAttendancePage';
import ClientInfoPage from '../pages/admin/settings/client/ClientInfoPage';
import EmployeeDocumentPage from '../pages/admin/settings/employeeDocument/EmployeeDocumentPage';
import IncidentPageMaster from '../pages/admin/settings/incident/IncidentPage';
import OccurrenceCatgPage from '../pages/admin/settings/occurrenceCatg/OccurrenceCatgPage';
import SopDocumentPage from '../pages/admin/settings/sop-document/SopDocumentPage';
import RolesPage from '../pages/admin/settings/roles/RolesPage';
import AttendancePage from '../pages/admin/attendance/AttendancePage';
import OccurencePage from '../pages/admin/occurence/OccurencePage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route path='/auth/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/dashboard/e-occurrence' element={<OccurencePage />} />
                <Route path='/dashboard/attendance' element={<AttendancePage />} />
                <Route path='/dashboard/sites' element={<SitesPage />} />
                <Route path='/dashboard/sites/map' element={<MapPage />} />
                <Route path='/dashboard/sites/allocation' element={<AllocationPage />} />
                <Route path='/dashboard/sites/routes' element={<RoutePage />} />
                <Route path='/dashboard/sites/routes/pointers' element={<Pointers />} />
                <Route path='/dashboard/report' element={<ReportPage />} />
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
            </Routes>
        </Router>
    )
}

export default AppRoutes