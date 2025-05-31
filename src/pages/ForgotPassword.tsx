import { CheckCircle, LoaderCircle, UsersRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react";
import { Link, useNavigate /*,useSearchParams*/ } from "react-router-dom";
import Logo from "@/assets/ivyLight.png";
import LogoDark from "@/assets/ivyDark.png";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [loading, isLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>('')

    const submit = async () => {
        try {
            isLoading(true)
            const userData = {
              email: email,
            }

            /* AXIOS */
            const response = await api.post('/reset-password?api-key=AyomideEmmanuel', userData)

            if (response.status >= 200 && response.status < 300) {
              setSuccess(true)
              setSuccessMessage('Password reset link sent to your email')
              setTimeout(() => {
                navigate("/accounts/signin")
              }, 3000)
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
              const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
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
            isLoading(false)
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
          <span className="truncate text-xl font-semibold text-white">IVY LEAGUE ASSOCIATES</span>
        </div>
        <Card className="min-[641px]:min-w-[640px] mx-auto bg-transparent dark:bg-transparent border-none shadow-none sm:bg-white dark:sm:bg-gray-900 sm:border sm:shadow">
          <CardHeader>
            <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Forgot Password</CardTitle>
            <CardDescription className="text-center dark:text-white">Enter your email to reset your password</CardDescription>
          </CardHeader>
          <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center p-0 sm:p-6 sm:pt-0">
            <div className="max-[640px]:hidden flex sm:w-full sm:h-full sm:max-w-sm">
              <img src={Logo} alt="Ivy League" className="dark:hidden w-80 h-80 mx-auto" />
              <img src={LogoDark} alt="Ivy League" className="hidden dark:block h-80 mx-auto" />
            </div>

            <div className="sm:w-full sm:max-w-sm flex-1 sm:flex-auto">
              {success ? (
                <div className="flex flex-col gap-2 justify-center items-center py-20 max-[640px]:px-10 bg-accent dark:bg-cyan-500 rounded-lg">
                  <CheckCircle className="text-white size-16" />
                  <p className="text-white text-sm">{successMessage}</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col gap-2 justify-center items-center py-20 max-[640px]:px-10 bg-accent dark:bg-cyan-500 rounded-lg">
                  <LoaderCircle className="animate-spin text-white size-16" />
                  <p className="text-white text-sm">Please wait while we reset your password...</p>
                </div>
              ) : (
                <>
                <form 
                onSubmit={(e) => {
                    e.preventDefault()
                    submit()
                }} 
                className="space-y-4">
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

                    <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                        {loading ? <LoaderCircle className="animate-spin text-white" /> : 'Reset Password'}
                    </button>
                    </div>

                    {error && (
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
            </div>
          </CardContent>
        </Card>
      </div>
    )
}