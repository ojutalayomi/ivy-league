import { updateUserProfile } from "@/redux/userSlice";
import { CheckCircle, LoaderCircle, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { RootState } from "@/redux/store";
import AccountsLayout from "@/components/AccountsLayout";

export default function VerifyEmail() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user)
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>('')
    const count = useRef(0)

    useEffect(() => {
      if (token && count.current === 0) {
        (async () => {
          count.current += 1;
          await submit(false)
        })()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const submit = async (getCode = true) => {
      try {
        setError('')
        if (token) {
            setLoading2(true)
        } else {
            setLoading(true)
        }
        const userData = {
          email: email,
        }

        /* AXIOS */
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = token && !getCode
            ? await api.post('/confirm-email', {token}, config)
            : await api.post('/confirm-email', userData, config);

        if (response.status >= 200 && response.status < 300) {
          setSuccess(true)
          setSuccessMessage(getCode ? 'Email verification link sent to your email' : 'Email verified successfully')
          setTimeout(() => {
            if(getCode) {
              return;
            } else {
              if (user.signed_in) navigate("/home")
              else navigate("/accounts/signin")
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
              // console.error('API Error:', axiosError.response.data.error)
              setError(axiosError.response.data.error)
          } else {
              // console.error('Unexpected error:', error)
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
            <CheckCircle className="text-cyan-500 size-16" /> 
            <div className="text-center text-muted-foreground">{successMessage}</div>
          </div>
        ) : loading2 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <LoaderCircle className="animate-spin" /> 
            <div className="text-center text-muted-foreground">Please wait while we verify your email... <br /> This may take a few seconds.</div>
          </div>
        ) : (
          <>
          <div className="space-y-2">
            <div className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Verify your email</div>
            <div className="text-center text-muted-foreground">Enter your email to verify your account</div>
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
                          <p className="text-red-500 text-sm">Please request a new verification link</p>
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
                    type={token ? "text" : "email"}
                    defaultValue={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3 py-1.5 sm:text-primary sm:placeholder:text-primary sm:text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                {loading ? <LoaderCircle className="animate-spin text-white" /> : 'Verify Email'}
              </button>
              </div>

              {error && !error.includes('token is invalid') && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {/* <strong className="font-bold">Error:</strong>  */}
                {error}
              </div>
              )}
          </form>

          <p className="mt-2 text-center text-sm/6 text-white sm:text-gray-500">
              Don't have an account?{' '}
              <Link to="/accounts/signup" className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50">
              Sign up
              </Link>
          </p>
          </>
        )}
      </AccountsLayout>
    )
}