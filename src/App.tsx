import ManageStudents from '@/pages/admin/ManageStudents'
import ManageStudentsMenu from '@/pages/admin/ManageStudentsMenu'
import Menu from '@/pages/Menu'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import * as reactRouterDom from 'react-router-dom'
import { ThemeProvider } from '@/providers/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Toaster } from "@/components/ui/toaster";
import Error404Page from '@/components/404'
import Dashboard from '@/pages/student/Dashboard'
import { Provider } from 'react-redux';
import { store } from '@/redux/store'
import AdditionalInfo from './pages/student/AdditionalInfo'
import LogoDark from "@/assets/ivyDark.png";
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
// import './App.css'

function App() {
  return (
    <reactRouterDom.BrowserRouter>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="ivy-ui-theme">
          <Router />
          <Toaster />
        </ThemeProvider>
      </Provider>
    </reactRouterDom.BrowserRouter>
  )
}

export default App

function Router() {
  const [isLoading, setIsLoading] = useState(true);
  const location = reactRouterDom.useLocation()
  const state = location.state as { backgroundLocation?: Location }
  const user = useSelector((state: RootState) => state.user);
  const pathSegments = (user.user_status === '' && location.pathname.startsWith('/dashboard')) ? location.pathname.replace("dashboard","manage-students") : location.pathname.replace("dashboard","student-dashboard")
  const backgroundLocation = state?.backgroundLocation;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <>
    <div className="w-screen h-screen bg-greybg-light bg-cover bg-center bg-fixed bg-no-repeat">
      <div className="relative backdrop-blur-sm z-10 w-full h-full overflow-y-auto">
        {!isLoading && (
          <reactRouterDom.Routes location={backgroundLocation || location}>
            <reactRouterDom.Route path="/" element={<Menu />} />
            <reactRouterDom.Route path="/manage-students/*" element={
              <reactRouterDom.Routes>
                <reactRouterDom.Route path='/' element={<ManageStudentsMenu />} />
                <reactRouterDom.Route path='/*' element={<ManageStudents />} />
              </reactRouterDom.Routes>
            } />
            <reactRouterDom.Route path="/dashboard/*" element={<reactRouterDom.Navigate to={pathSegments} replace />} />
            <reactRouterDom.Route path="/student-dashboard/*" element={
              (user.signed_in && user.user_status !== '' ? (
                <reactRouterDom.Routes>
                  <reactRouterDom.Route path='/*' element={<Dashboard />} />
                </reactRouterDom.Routes>
              ) : (() => {
                // if (location.pathname.startsWith('/student-dashboard')) {
                //   toast({
                //     title: "You are not authorized to access this page",
                //     description: "Please sign in to continue",
                //     variant: "destructive"
                //   })
                // }
                return (
                  <reactRouterDom.Navigate to="/accounts/signin" replace />
                )
              })())
            } />
            <reactRouterDom.Route path="/accounts/signin" element={<SignIn />} />
            <reactRouterDom.Route path="/accounts/signup" element={<SignUp />} />
            <reactRouterDom.Route path="/accounts/additional-info" element={<AdditionalInfo />} />
            <reactRouterDom.Route path="/*" element={<Error404Page />} />
          </reactRouterDom.Routes>
        )}
      </div>
      <div className="absolute bottom-0 mb-4 mr-4 right-0 z-[100]">
        <ModeToggle />
      </div>
    </div>
    {isLoading && (
      <div className="absolute bottom-0 mb-4 mr-4 right-0 z-[100] animate-in animate-out fade-out-0 fade-in-0">
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <img src={LogoDark} alt="Ivy League Associates Logo" className="h-52" />
            {/* <h1 className="text-2xl font-bold">Ivy League Associates</h1> */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}