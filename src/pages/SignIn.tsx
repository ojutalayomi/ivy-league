import { setUser } from "@/redux/userSlice";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, UsersRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { User } from "@/lib/types";
import Logo from "@/assets/ivyLight.png";
import LogoDark from "@/assets/ivyDark.png";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

export default function SignIn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect') === '/' ? '/dashboard/home' : searchParams.get('redirect')
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [loading, isLoading] = useState<boolean>(false)
    const [accountType, setAccountType] = useState<string>('')
    const [usersList, setUsersList] = useState<User[]>([])

    useEffect(() => {
      document.title = "Sign In - Ivy League Associates" + accountType;
    }, [accountType]);

    useEffect(() => {
        const storedUsers = localStorage.getItem('ivy_users_list')
        if (storedUsers) {
          setUsersList(JSON.parse(storedUsers))
        }
    }, [])

    const handleSwitchUser = (username: string) => {
      try {
          if (!username) {
              toast.error("Oops!",{
                  description: "No user found to switch to"
              })
              navigate('/accounts/login')
              return
          }

          const success = false //switchUser(username)
          if (success) {
              toast.success("Successfully switched user",{
                description: "You are now signed in as " + username
              })
              navigate('/accounts/profile')
          } else {
              toast.error("Oops!",{
                  description: "Failed to switch user"
              })
          }
      } catch (error) {
          console.error('Switch user error:', error)
          toast.error("Oops!",{
              description: "An error occurred while switching user"
          })
      }
    }

    const submit = async () => {
      try {
        isLoading(true)
        const userData = {
          type: 'email',
          email: email,
          password: password
        }

        // const user = (() => {
        //   if(accountType === 'admin') {
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
          localStorage.setItem('ivy_user_token', JSON.stringify({token: response.data.email, timestamp: Date.now()}))
          dispatch(setUser({...response.data, signed_in: true}))
          toast.success("You have signed in succesfully.",{
            description: "Thank you for signing in to your account. We look forward to helping you achieve your academic goals."
          })
          navigate(redirect || "/dashboard/home")
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
      <div className={`flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8`}>
        <div className="max-[640px]:flex hidden items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-500 text-white">
            <UsersRound className="size-4" />
          </div>
          <span className="truncate text-xl font-semibold">IVY LEAGUE ASSOCIATES</span>
        </div>
        <Card className="min-[641px]:min-w-[640px] mx-auto bg-transparent dark:bg-transparent border-none shadow-none sm:bg-white dark:sm:bg-gray-900 sm:border-1 sm:border-solid sm:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Sign in to your account</CardTitle>
            <CardDescription className="text-center dark:text-white">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center p-0 sm:p-6 sm:pt-0">
            <div className="max-[640px]:hidden flex sm:w-full sm:h-full sm:max-w-sm">
              <img src={Logo} alt="Ivy League" className="dark:hidden w-80 h-80 mx-auto" />
              <img src={LogoDark} alt="Ivy League" className="hidden dark:block h-80 mx-auto" />
            </div>

            <div className="sm:w-full sm:max-w-sm flex-1 sm:flex-auto">
              {usersList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 text-cyan-500">Sign in as:</h3>
                  <div className="flex flex-wrap gap-2">
                    {usersList.map((user, index) => {
                      const isCurrentSession = Cookies.get('pt_session') === user.token
                      return (
                        <button
                          key={index}
                          onClick={() => handleSwitchUser(user.username)}
                          className="flex items-center gap-2 max-w-32 text-left px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.username}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                              <span className="text-xs text-sidebar-primary">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm truncate">{user.username}</span>
                          <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      {isCurrentSession ? <Check className="h-4 w-4 text-muted-foreground" /> : <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                      <p>{isCurrentSession ? 'Current User' : 'Switch User'}</p>
                                  </TooltipContent>
                              </Tooltip>
                          </TooltipProvider>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              <form 
              onSubmit={(e) => {
                  e.preventDefault()
                  submit()
              }} 
              className="space-y-4">
                <Tabs defaultValue='student' onValueChange={(type) => setAccountType(type)}>
                  {/* <TabsList className="bg-blue-50 dark:bg-muted/20 dark:border h-auto rounded-full grid w-full grid-cols-2">
                    <TabsTrigger value="admin" className="data-[state=active]:bg-cyan-500 data-[state=active]:hover:bg-cyan-400 data-[state=active]:text-white rounded-full">Admin</TabsTrigger>
                    <TabsTrigger value="student" className="data-[state=active]:bg-cyan-500 data-[state=active]:hover:bg-cyan-400 data-[state=active]:text-white rounded-full">Student</TabsTrigger>
                  </TabsList> */}
                  <TabsContent value="admin">
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
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-white sm:dark:text-gray-100 sm:text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
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
                          className="block w-full rounded-md border-0 px-2 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
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
                      className="block w-full rounded-md border-0 px-3 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
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

              <p className="mt-2 text-center text-sm/6 sm:text-gray-500">
                Don't have an account?{' '}
                <Link to={`/accounts/signup${redirect ? `?redirect=${redirect}` : ''}`} className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50  dark:text-gray-200 dark:hover:text-gray-300">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}