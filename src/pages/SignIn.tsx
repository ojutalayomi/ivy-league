import { setUser } from "@/redux/userSlice";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { setBearerToken } from "@/redux/utilsSlice";
import { useUser } from "@/providers/user-provider";
import AccountsLayout from "@/components/AccountsLayout";
import { CheckForIncorrectPermission } from "@/lib/utils";

export default function SignIn() {
  const { Mode, user } = useUser();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [error, setError] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, isLoading] = useState<boolean>(false)
  const [accountType, setAccountType] = useState<string>('')

  useEffect(() => {
    document.title = "Sign In - Ivy League Associates" + accountType;
  }, [accountType]);

  const submit = async () => {
    try {
      isLoading(true)
      const userData = {
        type: 'email',
        email: email,
        password: password
      }

      // const user = (() => {
      //   if(accountType === 'staff') {
      //     return users.find(u => u.email === email)
      //   } else {
      //     return students.find(s => s.registrationNumber === email)
      //   }
      // })()
      // if (user) {
      //   if (password === user.name.toLowerCase().split(' ')[1]) localStorage.setItem("ivy-user", JSON.stringify(user))
      //   else throw Error("Invalid password")  
      // } else {
      //   throw Error("User not found!")
      // }

      /* AXIOS */
      const response = await api.post('/signin', userData)

      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        const correctPermission = CheckForIncorrectPermission(data, toast, Mode, dispatch, navigate);
        if (correctPermission === 1) return;
        localStorage.setItem('ivy_user_token', JSON.stringify({token: data.email, timestamp: Date.now()}))
        dispatch(setUser({...data, signed_in: true}))
        dispatch(setBearerToken(data.bearer_token))
        toast.success("You have signed in succesfully.",{
          description: data.user_status === "student" ? "Thank you for signing in to your account. We look forward to helping you achieve your academic goals." : "Welcome to the staff portal. We look forward to helping you manage your students."
        })
        
        navigate(redirect ? redirect : '/');
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
        if (message && typeof message !== 'object') {
          setError(message)
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
        setError(description)
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } }
        console.error('API Error:', axiosError.response.data.error)
        setError(axiosError.response.data.error)
      } else {
        console.error('Unexpected error:', error)
        setError('An unexpected error occurred')
      }
    } finally {
      isLoading(false)
    }
  }
  
  return (
    <AccountsLayout>
      <div className="space-y-2">
        <div className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Sign in to your {Mode} account</div>
        <div className="text-center text-muted-foreground">Enter your credentials to access your account</div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }} 
        className="space-y-4 w-full max-w-sm">
          <Tabs defaultValue={Mode || 'student'} onValueChange={(type) => setAccountType(type)}>
            {/* <TabsList className="bg-blue-50 dark:bg-muted/20 dark:border h-auto rounded-full grid w-full grid-cols-2">
              <TabsTrigger value="staff" className="data-[state=active]:bg-cyan-500 data-[state=active]:hover:bg-cyan-400 data-[state=active]:text-white rounded-full">Admin</TabsTrigger>
              <TabsTrigger value="student" className="data-[state=active]:bg-cyan-500 data-[state=active]:hover:bg-cyan-400 data-[state=active]:text-white rounded-full">Student</TabsTrigger>
            </TabsList> */}
            <TabsContent value="staff">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-cyan-500">
                  Email address
                </label>
                <div className="mt-2">
                  <Input
                    disabled={loading}
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-2 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-cyan-500 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="student">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-cyan-500">
                  Registration Number or Email
                </label>
                <div className="mt-2">
                  <Input
                    disabled={loading}
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    defaultValue={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="registrationNumber"
                    className="block w-full rounded-md border-0 px-2 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-cyan-500 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-cyan-500">
                Password
              </label>
              <div className="text-sm">
                <Link to="/accounts/reset-password" className="font-semibold text-gray-500 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2 relative">
              <Input
                disabled={loading}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 px-3 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-cyan-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              {loading ? <LoaderCircle className="animate-spin text-white" /> : 'Sign in'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {/* <strong className="font-bold">Error:</strong>  */}
              {error}
            </div>
          )}
        </form>

        {Mode !== "staff" && (
          <p className="mt-2 text-center text-sm/6 sm:text-gray-500">
            Don't have an account?{' '}
            <Link to={`/accounts/signup${redirect ? `?redirect=${redirect}` : ''}`} className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50  dark:text-gray-200 dark:hover:text-gray-300">
              Sign up
            </Link>
          </p>
        )}
        {user.signed_in && (
          <p className="mt-2 text-center text-sm/6 sm:text-gray-500">
            You are signed in.{' '}
          <Link to="/" className="font-semibold text-cyan-500 hover:text-cyan-400 hover:underline">
              Go to Dashboard
            </Link>
          </p>
        )}
    </AccountsLayout>
  )
}