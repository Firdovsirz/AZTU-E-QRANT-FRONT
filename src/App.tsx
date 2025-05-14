import Blank from "./pages/Blank";
import { Provider } from "react-redux";
import Calendar from "./pages/Calendar";
import Home from "./pages/Dashboard/Home";
import { useSelector } from "react-redux";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import BarChart from "./pages/Charts/BarChart";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import { RootState, store } from "./redux/store";
import UserProfiles from "./pages/UserProfiles";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import { ScrollToTop } from "./components/common/ScrollToTop";
import UserDetailsPage from "./pages/UserDetails/UserDetailsPage";
import UserTypeChoicePage from "./pages/AuthPages/UserTypeChoicePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectDetailsPage from "./pages/ProjectDetailsPage/ProjectDetailsPage";
import AcademicTypeChoicePage from "./pages/AuthPages/AcademicTypeChoicePage";

export default function App() {
  return (
    <Provider store={store}>
      <AppWithRouter />
    </Provider>
  );
}

function AppWithRouter() {
  const userType = useSelector((state: RootState) => state.auth.userType);
  const academicType = useSelector((state: RootState) => state.auth.academicType);
  console.log(userType, academicType);
  

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
          <Route path="/project-details" element={<ProjectDetailsPage />} />
          <Route path="/user-details" element={<UserDetailsPage />} />
        </Route>

        {/* <Route path="/signin-type" element={
          userType == null ? <UserTypeChoicePage /> : <AcademicTypeChoicePage />
        } /> */}
        <Route path="/signin" element={
          // userType != null && academicType != null ? <SignIn /> : <UserTypeChoicePage />
          userType === null ? <UserTypeChoicePage /> : academicType === null ? <AcademicTypeChoicePage /> : <SignIn />
        } />
        <Route path="/signup" element={userType === null ? <UserTypeChoicePage /> : academicType === null ? <AcademicTypeChoicePage /> : <SignUp />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}