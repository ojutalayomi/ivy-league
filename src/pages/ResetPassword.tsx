import { updateUserProfile } from "@/redux/userSlice";
import { CheckCircle, LoaderCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useTheme } from "@/providers/theme-provider";
import AccountsLayout from "@/components/AccountsLayout";
import { useUser } from "@/providers/user-provider";

export default function ResetPassword() {
    const dispatch = useDispatch()
    useTheme();
    const { user } = useUser()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirect')
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>(user.email)
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
      <AccountsLayout>
        {success ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <CheckCircle className="size-16" />
            <p className="text-muted-foreground text-sm">{successMessage}</p>
          </div>
        ) : loading2 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <LoaderCircle className="animate-spin size-16" />
            <p className="text-muted-foreground text-sm">Please wait while we reset your password...</p>
          </div>
        ) : (
          <>
          <div className="space-y-2">
            <div className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Reset your password</div>
            <div className="text-center text-muted-foreground">Enter your email to reset your password</div>
          </div>
          <form 
          onSubmit={async (e) => {
              e.preventDefault()
              await submit()
          }} 
          className="space-y-4 w-full max-w-sm">
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
      </AccountsLayout>
    )
}