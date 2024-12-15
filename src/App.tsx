import ManageUsers from './pages/ManageUsers'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import * as reactRouterDom from 'react-router-dom'
// import './App.css'

function App() {
  return (
    <reactRouterDom.BrowserRouter>
      <Router />
    </reactRouterDom.BrowserRouter>
  )
}

export default App

function Router() {
  const location = reactRouterDom.useLocation()
  const state = location.state as { backgroundLocation?: Location }
  const backgroundLocation = state?.backgroundLocation
  return (
    <div className="w-screen h-screen bg-greybg-light-gradient bg-cover bg-center bg-no-repeat ">
      <reactRouterDom.Routes location={backgroundLocation || location}>
        <reactRouterDom.Route path="/" element={<SignIn />} />
        <reactRouterDom.Route path="/manage-users/*" element={<ManageUsers />} />
        <reactRouterDom.Route path="/accounts/signin" element={<SignIn />} />
        <reactRouterDom.Route path="/accounts/signup" element={<SignUp />} />
      </reactRouterDom.Routes>
    </div>
  )
}