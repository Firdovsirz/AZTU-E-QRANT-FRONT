import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import { Provider, useSelector } from "react-redux";
import UserViewPage from "./pages/UserView/UserViewPage";
import { RootState, store, persistor } from "./redux/store";
import MainSmetaPage from "./pages/MainSmeta/MainSmetaPage";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PersistGate } from "redux-persist/integration/react";
import SmetaToolsPage from "./pages/SmetaTools/SmetaToolsPage";
import SmetaOtherPage from "./pages/SmetaOther/SmetaOtherPage";
import UserDetailsPage from "./pages/UserDetails/UserDetailsPage";
import SmetaSalaryPage from "./pages/SmetaSalary/SmetaSalaryPage";
import ProjectViewPage from "./pages/ProjectView/ProjectViewPage";
import ProjectTablePage from "./pages/ProjectTable/ProjectTablePage";
import UserTypeChoicePage from "./pages/AuthPages/UserTypeChoicePage";
import CollaboratorPage from "./pages/Collaborators/CollaboratorPage";
import SmetaServicesPage from "./pages/SmetaServices/SmetaServicesPage";
import SmetaExpensesPage from "./pages/SmetaExpenses/SmetaExpensesPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AcademicTypeChoicePage from "./pages/AuthPages/AcademicTypeChoicePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage/ProjectDetailsPage";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWithRouter />
      </PersistGate>
    </Provider>
  );
}

function AppWithRouter() {
  const finKod = useSelector((state: RootState) => state.auth.fin_kod);
  const userType = useSelector((state: RootState) => state.auth.userType);
  const academicType = useSelector((state: RootState) => state.auth.academicType);
  console.log(userType, academicType);
  console.log(finKod);
  const projectRole = useSelector((state: RootState) => state.auth.projectRole);
  console.log(projectRole);
  const projectCode = useSelector((state: RootState) => state.auth.projectCode);
  console.log(projectCode);
  const token = useSelector((state: RootState) => state.auth.token);
  console.log(token);
  

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {token ? (
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/project-offer" element={<ProjectDetailsPage />} />
            <Route path="/user-details/:fin_kod" element={<UserDetailsPage />} />
            <Route path="/projects" element={<ProjectTablePage />} />
            <Route path="/collaborators" element={<CollaboratorPage />} />
            <Route path="/main-smeta" element={<MainSmetaPage />} />
            <Route path="/project-smeta-salary" element={<SmetaSalaryPage />} />
            <Route path="/project-smeta-tools" element={<SmetaToolsPage />} />
            <Route path="/project-smeta-services" element={<SmetaServicesPage />} />
            <Route path="/project-smeta-expences" element={<SmetaExpensesPage />} />
            <Route path="/project-smeta-other-expences" element={<SmetaOtherPage />} />
            <Route path="/project-view/:projectCode" element={<ProjectViewPage />} />
            <Route path="/user-view/:fin_kod" element={<UserViewPage />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}

        <Route
          path="/"
          element={
            userType === null ? (
              <UserTypeChoicePage />
            ) : academicType === null ? (
              <AcademicTypeChoicePage />
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
            ) : academicType === null ? (
              <AcademicTypeChoicePage />
            ) : (
              <SignUp />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}