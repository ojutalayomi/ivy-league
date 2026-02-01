import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchemaType, formSchema } from "@/lib/types";
import { Step1 } from "@/components/signup-steps";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { setUser } from "@/redux/userSlice";
import { useTheme } from "@/providers/theme-provider";
import AccountsLayout from "@/components/AccountsLayout";
import { Button } from "@/components/ui/button";

export default function SignUp() {
    const dispatch = useDispatch()
    useTheme();
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
            papers: [],
            blocked: false,
            role: null
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
      <AccountsLayout>
        <div className="space-y-2">
          <div className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Create your account</div>
          <div className="text-center text-muted-foreground">Enter your details to create your account</div>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-4 w-full max-w-sm">
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
        <p className="text-center text-sm/6 sm:text-gray-500">
          Already have an account?{' '}
          <Link to={`/accounts/signin${redirect ? `?redirect=${redirect}` : ''}`} className="font-semibold text-cyan-500 hover:text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </AccountsLayout>
    )
}