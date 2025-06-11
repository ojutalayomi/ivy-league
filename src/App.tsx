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
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store'
import AdditionalInfo from './pages/student/AdditionalInfo'
import LogoDark from "@/assets/ivyDark.png";
import LogoLight from "@/assets/ivyLight.png";
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import HelpCenter from './pages/HelpCenter'
import { updateUserProfile } from './redux/userSlice'
import { toast } from './hooks/use-toast'
import { api } from './lib/api'
import { AxiosError } from 'axios'
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
  const { isLoading, error } = useUser();
  const navigate = reactRouterDom.useNavigate();
  const location = reactRouterDom.useLocation()
  const state = location.state as { backgroundLocation?: Location }
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const pathSegments = (user.user_status === '' && location.pathname.startsWith('/dashboard')) ? location.pathname.replace("dashboard", "manage-students") : location.pathname.replace("dashboard", "student-dashboard")
  const backgroundLocation = state?.backgroundLocation;
  const verifyEmail = useRef(false);

  useEffect(() => {
    // 200 - Payment has been made; 202 - Payment pending; 410 - payment failed; 404 - payment not found
    window.addEventListener('message', (event) => {
      // Security: Verify the message is from your domain
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'paystack-auth') {
        console.log('Token received:', event.data.token);
        if (event.data.index === 0 && !verifyEmail.current) {
          const reference = event.data.token;
          verifyPayment(reference);
        }
      }
    });
    const verifyPayment = async (reference: string) => {
      if (!reference) {
        navigate("/student-dashboard/papers/", { replace: true })
        return
      }

      try {
        const response = await api.get(`/verify/${reference}`);

        switch (response.status) {
          case 200:
          {
            toast({
              title: response.data.status || "Payment Successful!",
              description: response.data.message || "Your payment has been successfully processed.",
              variant: "success"
            })
            console.log(response.data)
            dispatch(updateUserProfile({ 
              acca_reg: response.data.acca_reg_no || response.data.user_data.acca_reg_no, 
              reg_no: response.data.reg_no || response.data.user_data.reg_no, 
              fee: response.data.fee || response.data.user_data.fee,
              user_status: response.data.user_status || response.data.user_data.user_status,
              papers: response.data.papers || response.data.user_data.papers
            }))
            localStorage.removeItem('reference');
            const additional_info = JSON.parse(localStorage.getItem('additional_info_draft') || '{}')
            localStorage.setItem('additional_info_draft', JSON.stringify({ ...additional_info, acca_reg_no: response.data.acca_reg_no || response.data.user_data.acca_reg_no }))
            navigate("/student-dashboard/papers/view", { replace: true })
            verifyEmail.current = true;
            break;
          }
          case 202:
            toast({
              title: response.data.status || "Payment Pending",
              description: response.data.message || "Your payment is pending. Please wait while we verify your payment.",
            })
            break;
          default:
            toast({
              title: response.data.status || "Payment Verification Failed",
              description: response.data.message || "There was an error verifying your payment.",
              variant: "destructive"
            })
            break;
        }
      } catch (error) {
        console.error('Error fetching papers:', error);
        if (error instanceof Error) {
          const message = (error as AxiosError<{ error: { [x: string]: string } }>).response?.data?.error
           
          const [title, description] = Object.entries(message as { [x: string]: string })[0] || ['Error', 'An unexpected error occurred']
          toast({
            title: "Error",
            description: title.includes("Uncaught Error") ? "An unexpected error occurred" : description,
            variant: "destructive"
          })
        } else if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { error: string } } }
          console.error('API Error:', axiosError.response.data.error)
          toast({
            title: "Error",
            description: axiosError.response.data.error,
            variant: "destructive"
          })
        } else {
          console.error('Unexpected error:', error)
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive"
          })
        }
      } finally {
        // setIsVerifying(false)
      }
    }
    return () => {
      window.removeEventListener('message', (event: MessageEvent) => verifyPayment(event.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-800 dark:to-gray-900">
        <div className="relative backdrop-blur-sm z-10 w-full h-full overflow-y-auto">
          {!isLoading && (
            <reactRouterDom.Routes location={backgroundLocation || location}>
              <reactRouterDom.Route path="/" element={<Menu />} />
              <reactRouterDom.Route path="/help-center" element={<HelpCenter />} />
              <reactRouterDom.Route path="/manage-students/*" element={
                <reactRouterDom.Routes>
                  <reactRouterDom.Route path='/' element={<ManageStudentsMenu />} />
                  <reactRouterDom.Route path='/*' element={<ManageStudents />} />
                </reactRouterDom.Routes>
              } />
              <reactRouterDom.Route path="/dashboard/*" element={<reactRouterDom.Navigate to={pathSegments} replace />} />
              <reactRouterDom.Route path="/student-dashboard/*" element={
                (user.user_status !== '' ? (
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
              <reactRouterDom.Route path="/accounts/reset-password" element={<ResetPassword />} />
              <reactRouterDom.Route path="/accounts/confirm-email" element={<VerifyEmail />} />
              <reactRouterDom.Route path="/*" element={<Error404Page />} />
            </reactRouterDom.Routes>
          )}
        </div>
        <div className="absolute top-0 mt-4 mr-4 right-0 z-[100]">
          <ModeToggle />
        </div>
      </div>
      {isLoading && !error && (
        <div className="absolute bottom-0 mb-4 mr-4 right-0 z-[100] animate-in animate-out fade-out-0 fade-in-0">
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-4">
              <img src={LogoDark} alt="Ivy League Associates Logo" className="h-52 hidden dark:block" />
              <img src={LogoLight} alt="Ivy League Associates Logo" className="h-52 dark:hidden" />
              {/* <h1 className="text-2xl font-bold">Ivy League Associates</h1> */}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}