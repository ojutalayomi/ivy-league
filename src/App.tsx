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
// import './App.css'

function App() {
  return (
    <reactRouterDom.BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ivy-ui-theme">
        <Router />
        <Toaster />
      </ThemeProvider>
    </reactRouterDom.BrowserRouter>
  )
}

export default App

function Router() {
  const location = reactRouterDom.useLocation()
  const state = location.state as { backgroundLocation?: Location }
  const backgroundLocation = state?.backgroundLocation
  return (
    <div className="w-screen h-screen bg-greybg-light bg-cover bg-center bg-fixed bg-no-repeat">
      <div className="relative backdrop-blur-sm z-10 w-full h-full overflow-y-auto">
        <reactRouterDom.Routes location={backgroundLocation || location}>
          <reactRouterDom.Route path="/" element={<Menu />} />
          <reactRouterDom.Route path="/manage-students/*" element={
            <reactRouterDom.Routes>
              <reactRouterDom.Route path='/' element={<ManageStudentsMenu />} />
              <reactRouterDom.Route path='/*' element={<ManageStudents />} />
            </reactRouterDom.Routes>
          } />
          <reactRouterDom.Route path="/student-dashboard/*" element={
            <reactRouterDom.Routes>
              <reactRouterDom.Route path='/*' element={<Dashboard />} />
            </reactRouterDom.Routes>
          } />
          <reactRouterDom.Route path="/accounts/signin" element={<SignIn />} />
          <reactRouterDom.Route path="/accounts/signup" element={<SignUp />} />
          <reactRouterDom.Route path="/*" element={<Error404Page />} />
        </reactRouterDom.Routes>
        <div className="absolute bottom-0 mb-4 mr-4 right-0 z-50">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}