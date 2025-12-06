import ManageStudents from '@/pages/admin/ManageStudents'
import Menu from '@/pages/Menu'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import * as reactRouterDom from 'react-router-dom'
import { ThemeProvider } from '@/providers/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Toaster } from "@/components/ui/sonner";
import Dashboard from '@/pages/student/Dashboard'
import { Provider } from 'react-redux';
import { store } from '@/redux/store'
import AdditionalInfo from './pages/student/AdditionalInfo'
import LogoDark from "@/assets/ivyDark.png";
import LogoLight from "@/assets/ivyLight.png";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import HelpCenter from './pages/HelpCenter'
import { UserProvider, useUser } from './providers/user-provider'
// import './App.css'

function App() {
  return (
    <reactRouterDom.BrowserRouter>
      <Provider store={store}>
        <UserProvider>
          <ThemeProvider storageKey="ivy-ui-theme">
            <Router />
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </Provider>
    </reactRouterDom.BrowserRouter>
  )
}

export default App

function Router() {
  const { isLoading, error, Mode } = useUser();
  const location = reactRouterDom.useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const user = useSelector((state: RootState) => state.user);
  const pathSegments = (user.user_status === '' && location.pathname.startsWith('/dashboard')) ? location.pathname.replace("dashboard", "") : location.pathname.replace("dashboard", "")
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-800 dark:to-gray-900">
        <div className="relative backdrop-blur-sm z-10 w-full h-full overflow-y-auto">
          {!isLoading && (
            <reactRouterDom.Routes location={backgroundLocation || location}>
              <reactRouterDom.Route path="/menu" element={<Menu />} />
              <reactRouterDom.Route path="/help-center" element={<HelpCenter />} />
              <reactRouterDom.Route path="/dashboard/*" element={<reactRouterDom.Navigate to={pathSegments} replace />} />
              <reactRouterDom.Route path="/accounts/signin" element={<SignIn />} />
              <reactRouterDom.Route path="/accounts/signup" element={<SignUp />} />
              <reactRouterDom.Route path="/accounts/additional-info" element={<AdditionalInfo />} />
              <reactRouterDom.Route path="/accounts/reset-password" element={<ResetPassword />} />
              <reactRouterDom.Route path="/accounts/confirm-email" element={<VerifyEmail />} />
              <reactRouterDom.Route path="/*" element={Mode === "student" ? <Dashboard /> : <ManageStudents />} />
            </reactRouterDom.Routes>
          )}
        </div>
        {(location.pathname.startsWith('/accounts') || location.pathname ==='/') && (
          <div className="absolute top-0 mt-4 mr-4 right-0 z-[100]">
            <ModeToggle />
          </div>
        )}
      </div>
      {isLoading && !error && (
        <div className="absolute bottom-0 mb-4 mr-4 right-0 z-[100] animate-in animate-out fade-out-0 fade-in-0">
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-4">
              <img src={LogoDark} alt="Ivy League Associates Logo" className="h-52 hidden dark:block" />
              <img src={LogoLight} alt="Ivy League Associates Logo" className="h-52 dark:hidden" />
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}