import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// import ImportData_old from './pages/ImportData_old/ImportData_old';
import Registration_old from './pages/Registration_old/Registration_old';
import Verification from './pages/Verification/Verification';
// import ResetPassword from './pages/ResetPassword_old/ResetPassword_old';
import ResetPassword from './pages/ResetPassword/ResetPassword';
// import LogIn_old from './pages/LogIn_old/LogIn_old';
// import Payment from './pages/Payment/Payment';
import Stripe from './pages/Stripe/Stripe';
// import Profile_old from './pages/Profile_old/Profile_old';
import Upgrade from './pages/Upgrade/Upgrade';
import Desktop from './pages/Desktop/Desktop';
// import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
// import Email_old from './pages/Email_old/Email_old';
import Registration from './pages/Registration/Registraion';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Email from './pages/Email/Email';
import ImportData from './pages/ImportData/ImportData';
import DashBoard from './pages/DashBoard/DashBoard';

import Terms from './pages/Terms/Terms';
import Policy from './pages/Policy/Policy';
import ContactUs from './pages/ContactUs/ContactUs';

import paths from './utils/routing';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const NoMatchPage = () => {
  return <h3>404 - Not found</h3>;
};

function PublicRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          !localStorage.getItem("token")
            ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: paths.Importdata,
                  state: { from: location }
                }}
              />
            ))
      }
    />
  );
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          localStorage.getItem("token")
            ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: paths.Main,
                  state: { from: location }
                }}
              />
            ))
      }
    />
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <PublicRoute
            path={paths.Registration}
          >
            <Registration />
          </PublicRoute>
          {/* <PublicRoute
            path={paths.Verify}
          >
            <VerifyEmail />
          </PublicRoute> */}
          <PublicRoute
            path={paths.OldVerification}
          >
            <Verification />
          </PublicRoute>
          <PublicRoute
            path={paths.Email}
          >
            <Email />
          </PublicRoute>
          <PublicRoute
            path={paths.ResetPassword}
          >
            <ResetPassword />
          </PublicRoute>
          {/* <PublicRoute
            path={paths.NewResetPassword}
          >
            <NewResetPassword />
          </PublicRoute> */}
          <PublicRoute
            path={paths.Policy}
          >
            <Policy />
          </PublicRoute>
          <PublicRoute
            path={paths.Terms}
          >
            <Terms />
          </PublicRoute>
          {/*------------------------------------------------- new public pages---------------------------------------------------------------- */}
          {/* <PublicRoute
            path={paths.NewRegistration}
          >
            <NewRegistration />
          </PublicRoute> */}
          <PublicRoute
            path={paths.EmailPass}
          >
            <ResetPassword />
          </PublicRoute>
          <PublicRoute
            path={paths.Login}
            exact={false}
          >
            <Login />
          </PublicRoute>
          {/* <PublicRoute
            path={paths.Email}
          >
            <Email />
          </PublicRoute> */}
          {/* ---------------------------------------------------privates------------------------------------------------------------------------- */}
          <PrivateRoute
            path={paths.Profile}
          >
            <Profile />
          </PrivateRoute>
          <PrivateRoute
            path={paths.Upgrade}
          >
            <Upgrade />
          </PrivateRoute>
          <PrivateRoute
            path={paths.Desktop}
          >
            <Desktop />
          </PrivateRoute>
          <PrivateRoute
            path={paths.ContactUs}
          >
            <ContactUs />
          </PrivateRoute>
          <PrivateRoute
            path={paths.Payment}
          >
            <Stripe />
          </PrivateRoute>
          <PrivateRoute
            path={paths.Importdata}
            exact={true}
          >
            <ImportData />
          </PrivateRoute>
          {/* --------------------------new private routes-------------------------------------------------------------------------------- */}
          {/* <PrivateRoute
            path={paths.NewProfile}
          >
            <NewProfile />
          </PrivateRoute> */}
          {/* <PrivateRoute
            path={paths.ImportData}
          >
            <ImportData />
          </PrivateRoute> */}
          <PrivateRoute
            path={paths.DashBoard}
          >
            <DashBoard />
          </PrivateRoute>
          <PublicRoute
            path={paths.Main}
          >
            <Login />
          </PublicRoute>
          <Route>
            <NoMatchPage />
          </Route>
        </Switch>
      </BrowserRouter>
      <ToastContainer theme='colored' />
    </div>
  );
}

export default App;
