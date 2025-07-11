import { updateUserProfile } from "@/redux/userSlice";
import { CheckCircle, LoaderCircle, UsersRound, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "@/assets/ivyLight.png";
import LogoDark from "@/assets/ivyDark.png";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

export default function ResetPassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirect')
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>('')

    const submit = async () => {
        try {
            if (token) {
                if (!password || !confirmPassword) {
                    setError('Please enter a password')
                    return
                }
                if (password !== confirmPassword) {
                    setError('Passwords do not match')
                    return
                }
            }

            setError('')
            if (token) {
                setLoading2(true)
            } else {
                setLoading(true)
            }
            const userData = token ? {
              email,
              password,
              token
            } : {
              email
            }

            /* AXIOS */
            const response = token ? await api.post('/reset-password?token='+token, userData) : await api.post('/reset-password', userData)

            if (response.status >= 200 && response.status < 300) {
              setSuccess(true)
              setSuccessMessage(!token ? 'Password reset link sent to your email' : 'Password reset successfully')
              setTimeout(() => {
                if(!token) {
                    return;
                } else {
                    navigate(redirect ? redirect : "/accounts/signin")
                }
                dispatch(updateUserProfile({email_verified: true}))
              }, 3000)
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
              const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
              if (message && typeof message !== 'object') {
                setError(message)
                return;
              }
              const [title, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
              setError(title + '\n ' + description)
            } else if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response: { data: { error: string } } }
                setError(axiosError.response.data.error)
            } else {
                setError('An unexpected error occurred')
            }
            if (token) {
                setLoading2(false)
            } else {
                setLoading(false)
            }
        } finally {
          if (token) {
            setLoading2(false)
            setTimeout(() => {
                setSuccess(false)
            }, 3000)
          } else {
            setLoading(false)
          }
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
            <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Reset Password</CardTitle>
            <CardDescription className="text-center">{token ? "Enter your new password" : "Enter your email to reset your password"}</CardDescription>
          </CardHeader>
          <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center p-0 sm:p-6 sm:pt-0">
            <div className="max-[640px]:hidden flex sm:w-full sm:h-full sm:max-w-sm">
              <img src={Logo} alt="Ivy League" className="dark:hidden w-80 h-80 mx-auto" />
              <img src={LogoDark} alt="Ivy League" className="hidden dark:block h-80 mx-auto" />
            </div>

            <div className="sm:w-full sm:max-w-sm flex-1 sm:flex-auto">
              {success ? (
                <div className="flex flex-col gap-2 justify-center items-center py-20 max-[640px]:px-10 bg-cyan-500 rounded-lg">
                  <CheckCircle className="text-white size-16" />
                  <p className="text-white text-sm">{successMessage}</p>
                </div>
              ) : loading2 ? (
                <div className="flex flex-col gap-2 justify-center items-center py-20 max-[640px]:px-10 bg-cyan-500 rounded-lg">
                  <LoaderCircle className="animate-spin text-white size-16" />
                  <p className="text-white text-sm">Please wait while we reset your password...</p>
                </div>
              ) : (
                <>
                <form 
                onSubmit={async (e) => {
                    e.preventDefault()
                    await submit()
                }} 
                className="space-y-4">
                    {token && error && error.includes('token is invalid') && (
                        <div className="flex gap-2 justify-start items-center py-3 px-2 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <XCircle className="text-red-500 size-6" />
                            <div>
                                <p className="text-red-500 text-sm">Invalid token</p>
                                <p className="text-red-500 text-sm">Please request a new password reset link</p>
                            </div>
                        </div>
                    )}
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
                          className="block w-full rounded-md border-0 px-2 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    {token && (
                      <>
                        <div>
                          <label htmlFor="password" className="block text-sm/6 font-medium text-cyan-500">
                            New Password
                          </label>
                          <div className="mt-2">
                            <Input
                              disabled={loading}
                              id="password"
                              name="password"
                              type="password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                              className="block w-full rounded-md border-0 px-2 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-cyan-500">
                            Confirm New Password
                          </label>
                          <div className="mt-2">
                            <Input
                              disabled={loading}
                              id="confirmPassword"
                              name="confirmPassword" 
                              type="password"
                              value={confirmPassword}
                              onChange={e => setConfirmPassword(e.target.value)}
                              required
                              className="block w-full rounded-md border-0 px-2 py-1.5 sm:text-primary sm:placeholder:text-primary shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                        {loading ? <LoaderCircle className="animate-spin text-white" /> : token ? 'Reset Password' : 'Send Reset Link'}
                    </button>
                    </div>

                    {error && !error.includes('token is invalid') && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        {error}
                    </div>
                    )}
                </form>

                <p className="mt-2 text-center text-sm/6 sm:text-gray-500">
                  Don't have an account?{' '}
                  <Link to={`/accounts/signup${redirect ? `?redirect=${redirect}` : ''}`} className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50 dark:text-gray-200 dark:hover:text-gray-300">
                  Sign up
                  </Link>
                </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
}