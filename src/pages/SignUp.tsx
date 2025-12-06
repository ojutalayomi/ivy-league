// import { setCookie, UserList, switchUser } from "@/lib/utils";
// import { useFetchDetails } from "@/providers/fetch-details"
// import { setUser } from "@/redux/userSlice";
// import axios, { AxiosError } from "axios";
import { Loader2, UsersRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchemaType, formSchema } from "@/lib/types";
import { Step1 } from "@/components/signup-steps";
import Logo from "@/assets/ivyLight.png";
import LogoDark from "@/assets/ivyDark.png";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { setUser } from "@/redux/userSlice";

export default function SignUp() {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, watch, getValues, trigger, setValue } = useForm<FormSchemaType>({
      resolver: zodResolver(formSchema),
      mode: 'onChange'
    });

    useEffect(() => {
      document.title = "Sign Up - Ivy League Associates";
    }, []);

    const stepProps = { register, errors, watch, setValue };
    
    const submit: SubmitHandler<FormSchemaType> = async (data) => {
      try {
        setError('');
        const isValid = await trigger();
        
        if (!isValid) {
          return;
        }
        delete (data as Partial<FormSchemaType>).confirmPassword
        data.gender = data.title === 'Mr' ? 'male' : 'female';
        setIsLoading(true)
        // await new Promise(resolve => setTimeout(resolve, 3000));
        const response = await api.post("/signup", data)

        // console.log(response)

        if (response.status >= 200 && response.status < 300) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, confirmPassword, ...userData} = getValues();
          dispatch(setUser({
            ...userData,
            signed_in: true,
            user_status: 'signee',
            gender: userData.title === 'Mr' ? 'male' : 'female',
            reg_no: "",
            acca_reg: "",
            phone_no: "",
            profile_pic: "",
            address: "",
            fee: [],
            scholarship: [],
            email_verified: false,
            papers: []
          }))
          localStorage.setItem('ivy_user_token', JSON.stringify({token: response.data.email, timestamp: Date.now()}))
          toast.success("Welcome to Ivy League Associates. Please check your email for a verification link.",{
            description: "Thank you for joining Ivy League Associates! We look forward to helping you achieve your academic goals."
          })
          setIsLoading(false)
          setError('')
          navigate(redirect ? redirect : '/')
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
            // console.error('API Error:', axiosError.response.data.error)
            setError(axiosError.response.data.error)
        } else {
            // console.error('Unexpected error:', error)
            setError('An unexpected error occurred')
        }
          setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    };
    
    return (
      <div className={`flex min-h-full flex-1 flex-col items-center justify-center px-6 lg:px-8`}>
        <div className="max-[640px]:flex hidden items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-500 text-white">
            <UsersRound className="size-4" />
          </div>
          <span className="truncate text-xl font-semibold tracking-tight text-cyan-500">IVY LEAGUE ASSOCIATES</span>
        </div>
        <Card className="sm:min-w-[660px] mx-auto bg-transparent dark:bg-transparent border-none shadow-none sm:bg-white dark:sm:bg-gray-900 sm:border-1 sm:border-solid sm:shadow-lg">
          <CardHeader className="py-3">
            <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Create your account</CardTitle>
            <CardDescription className="text-center sm:text-primary">Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center p-0 sm:pb-3 sm:px-6">
            <div className="max-[640px]:hidden flex flex-col sm:w-full sm:h-full sm:max-w-sm">
              <img src={Logo} alt="Ivy League" className="dark:hidden w-80 h-80 mx-auto" />
              <img src={LogoDark} alt="Ivy League" className="hidden dark:block h-80 mx-auto" />
              {error && (
                <div className="max-[640px]:hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="sm:w-full sm:max-w-sm">

              <form onSubmit={handleSubmit(submit)} className="space-y-6 p-4 sm:dark:border sm:dark:border-gray-700 rounded-lg">
                <Step1 {...stepProps} />
                
                {error && (
                  <div className="hidden max-[640px]:block bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {error}
                  </div>
                )}

                <div className="flex justify-between mt-3">
                  <Button 
                  type="submit" 
                  className="w-full bg-cyan-500 text-white"
                  disabled={isLoading}
                  onClick={() => submit(getValues())}
                  >
                  {isLoading ? (
                      <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                      </>
                  ) : (
                      'Create Account'
                  )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center py-1.5">
            <p className="text-center text-sm/6 sm:text-gray-500">
                Already have an account?{' '}
                <Link to={`/accounts/signin${redirect ? `?redirect=${redirect}` : ''}`} className="font-semibold text-cyan-500 hover:text-cyan-400 hover:underline">
                  Sign in
                </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
}