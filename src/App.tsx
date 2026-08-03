import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import Experts from "./components/experts/Experts";
import { Provider, useSelector } from "react-redux";
import SetExpert from "./components/setExpert/SetExpert";
import NewExpert from "./components/newExpert/NewExpert";
import UserViewPage from "./pages/UserView/UserViewPage";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState, store, persistor } from "./redux/store";
import MainSmetaPage from "./pages/MainSmeta/MainSmetaPage";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PersistGate } from "redux-persist/integration/react";
import SmetaToolsPage from "./pages/SmetaTools/SmetaToolsPage";
import SmetaOtherPage from "./pages/SmetaOther/SmetaOtherPage";
import NewPasswordPage from "./pages/AuthPages/NewPassworPage";
import MyProjectPage from "./pages/MyProjectPage/MyProjectPage";
import UserDetailsPage from "./pages/UserDetails/UserDetailsPage";
import SmetaSalaryPage from "./pages/SmetaSalary/SmetaSalaryPage";
import ProjectViewPage from "./pages/ProjectView/ProjectViewPage";
import PrioritetsPage from "./pages/PrioritetsPage/PrioritetsPage";
import OtpVerificationPage from "./pages/AuthPages/OtpVerification";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage";
import ProjectTablePage from "./pages/ProjectTable/ProjectTablePage";
import UserTypeChoicePage from "./pages/AuthPages/UserTypeChoicePage";
import CollaboratorPage from "./pages/Collaborators/CollaboratorPage";
import SmetaServicesPage from "./pages/SmetaServices/SmetaServicesPage";
import SmetaExpensesPage from "./pages/SmetaExpenses/SmetaExpensesPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage/ProjectDetailsPage";
import CollboratorProject from "./components/collaboratorProject/CollboratorProject";
import ApproveWaitingUsersPage from "./pages/ApproveWaitingUsersPage/ApproveWaitingUsersPage";
import ApproveWaitingCollaboratorsPage from "./pages/ApproveWaitingCollaboratorsPage/ApproveWaitingCollaboratorsPage";
import RolePermissionsPage from "./pages/RolePermissionsPage/RolePermissionsPage";
import ProjectActivitiesPage from "./pages/ProjectActivitiesPage/ProjectActivitiesPage";
import QuarterlyReportPage from "./pages/QuarterlyReportPage/QuarterlyReportPage";
import ExpertSigninPage from "./pages/AuthPages/ExpertSigninPage";
import { useState, useEffect } from "react";
import { getLockStatus } from "./services/lock/lockService";
import LockViewPage from "./pages/LockViewPage.tsx/LockViewPage";
import SubmittedUsersPage from "./pages/SubmittedUsersPage/SubmittedUsersPage";
import AnnouncementsPage from "./pages/AnnouncementsPage/AnnouncementsPage";
import RoleChangePage from "./pages/RoleChangePage/RoleChangePage";
import RoleChangeRequestsPage from "./pages/RoleChangeRequestsPage/RoleChangeRequestsPage";
import CompetitionsPage from "./pages/CompetitionsPage/CompetitionsPage";
import MessagesPage from "./pages/MessagesPage/MessagesPage";
import AdminMessagesPage from "./pages/AdminMessagesPage/AdminMessagesPage";
import ProjectHistoryViewPage from "./pages/ProjectHistoryView/ProjectHistoryViewPage";
import ProjectsArchivePage from "./pages/ProjectsArchivePage/ProjectsArchivePage";
import ArchiveProjectEditPage from "./pages/ArchiveProjectEditPage/ArchiveProjectEditPage";
import MyHistoryPage from "./pages/MyHistoryPage/MyHistoryPage";

export default function App() {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppWithRouterWrapper />
        </PersistGate>
      </Provider>
    </Router>
  );
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

function AppWithRouterWrapper() {
  const token = useSelector((state: RootState) => state.auth.token);
  const userType = useSelector((state: RootState) => state.auth.userType);
  const [lock, setLock] = useState<boolean>(false);

  useEffect(() => {
    const fetchLockStatus = async () => {
      try {
        const res = await getLockStatus();
        setLock(res.locked);
      } catch (err) {
        console.error("Failed to fetch lock status", err);
        setLock(false);
      }
    };

    fetchLockStatus();
  }, [lock]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={token && !isTokenExpired(token) ? "/home" : "/signin"} replace />
          }
        />
        {token && !isTokenExpired(token) ? (
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/project-offer" element={<ProjectDetailsPage />} />
            <Route path="/user-details/:fin_kod" element={<UserDetailsPage />} />
            <Route path="/projects" element={<ProjectTablePage />} />
            <Route path="/collaborators" element={<CollaboratorPage />} />
            <Route path="/main-smeta" element={!lock ? <MainSmetaPage /> : <LockViewPage />} />
            <Route path="/project-smeta-salary" element={!lock ? <SmetaSalaryPage /> : <LockViewPage />} />
            <Route path="/project-activities" element={!lock ? <ProjectActivitiesPage /> : <LockViewPage />} />
            <Route path="/quarterly-report" element={<QuarterlyReportPage />} />
            <Route path="/project-smeta-tools" element={!lock ? <SmetaToolsPage /> : <LockViewPage />} />
            <Route path="/project-smeta-services" element={!lock ? <SmetaServicesPage /> : <LockViewPage />} />
            <Route path="/project-smeta-expences" element={!lock ? <SmetaExpensesPage /> : <LockViewPage />} />
            <Route path="/project-smeta-other-expences" element={!lock ? <SmetaOtherPage /> : <LockViewPage />} />
            <Route path="/project-view/:projectCode" element={<ProjectViewPage />} />
            <Route path="/user-view/:fin_kod" element={<UserViewPage />} />
            <Route path="/my-project" element={<MyProjectPage />} />
            <Route path="/approve-waiting-users" element={<ApproveWaitingCollaboratorsPage />} />
            <Route path="/approve-waiting-auth-users" element={<ApproveWaitingUsersPage />} />
            <Route path="/set-expert" element={<SetExpert />} />
            <Route path="/new-expert" element={<NewExpert />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/prioritets" element={<PrioritetsPage />} />
            <Route path="/collaborator-project" element={<CollboratorProject />} />
            <Route path="/role-permissions" element={<RolePermissionsPage />} />
            <Route path="/projects/submitted" element={<SubmittedUsersPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/role-change" element={<RoleChangePage />} />
            <Route path="/role-change-requests" element={<RoleChangeRequestsPage />} />
            <Route path="/competitions" element={<CompetitionsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages-admin" element={<AdminMessagesPage />} />
            <Route path="/project-history/:projectCode" element={<ProjectHistoryViewPage />} />
            <Route path="/projects/archive" element={<ProjectsArchivePage />} />
            {/* Not behind the smeta `lock`: access is granted per project by an admin. */}
            <Route path="/archive/project/:projectCode/edit" element={<ArchiveProjectEditPage />} />
            <Route path="/my-history" element={<MyHistoryPage />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/signin" />} />
        )}

        <Route
          path="/signin"
          element={
            userType === null ? (
              <UserTypeChoicePage />
            ) : (
                <SignIn />
              )
          }
        />
        <Route
          path="/signup"
          element={
            userType === null ? (
              <UserTypeChoicePage />
            )
              // : academicType === null ? (
              //   <AcademicTypeChoicePage />
              // )
              : (
                <SignUp />
              )
          }
        />
        <Route path="/expert-signin" element={<ExpertSigninPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/otp-verification/:finKod" element={<OtpVerificationPage />} />
        <Route path="/reset-password/:token" element={<NewPasswordPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}