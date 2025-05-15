import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import BarChart from "./pages/Charts/BarChart";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import UserProfiles from "./pages/UserProfiles";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import NotFound from "./pages/OtherPage/NotFound";
import { Provider, useSelector } from "react-redux";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import { RootState, store, persistor } from "./redux/store";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PersistGate } from "redux-persist/integration/react";
import SmetaToolsPage from "./pages/SmetaTools/SmetaToolsPage";
import UserDetailsPage from "./pages/UserDetails/UserDetailsPage";
import SmetaSalaryPage from "./pages/SmetaSalary/SmetaSalaryPage";
import ProjectTablePage from "./pages/ProjectTable/ProjectTablePage";
import UserTypeChoicePage from "./pages/AuthPages/UserTypeChoicePage";
import SmetaServicesPage from "./pages/SmetaServices/SmetaServicesPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectDetailsPage from "./pages/ProjectDetailsPage/ProjectDetailsPage";
import AcademicTypeChoicePage from "./pages/AuthPages/AcademicTypeChoicePage";
import SmetaExpensesPage from "./pages/SmetaExpenses/SmetaExpensesPage";
import SmetaOtherPage from "./pages/SmetaOther/SmetaOtherPage";
import MainSmetaPage from "./pages/MainSmeta/MainSmetaPage";
import CollaboratorPage from "./pages/Collaborators/CollaboratorPage";

export default function App() {
  return (
    <Provider store={store}>
      {/* PersistGate delays rendering until redux-persist rehydrates */}
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

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/project-offer" element={<ProjectDetailsPage />} />
          <Route path="/user-details" element={<UserDetailsPage />} />
          <Route path="/projects" element={<ProjectTablePage />} />
          <Route path="/collaborators" element={<CollaboratorPage />} />
          <Route path="/main-smeta" element={<MainSmetaPage />} />
          <Route path="/project-smeta-salary" element={<SmetaSalaryPage />} />
          <Route path="/project-smeta-tools" element={<SmetaToolsPage />} />
          <Route path="/project-smeta-services" element={<SmetaServicesPage />} />
          <Route path="/project-smeta-expences" element={<SmetaExpensesPage />} />
          <Route path="/project-smeta-other-expences" element={<SmetaOtherPage />} />
        </Route>

        <Route
          path="/signin"
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