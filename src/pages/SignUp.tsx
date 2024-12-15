import { toast } from "@/hooks/use-toast";
// import { setCookie, UserList, switchUser } from "@/lib/utils";
// import { useFetchDetails } from "@/providers/fetch-details"
// import { setUser } from "@/redux/userSlice";
// import axios, { AxiosError } from "axios";
import { Loader2, UsersRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { Link, useNavigate /*,useSearchParams*/ } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchemaType, SignUpData, formSchema } from "@/lib/types";
import { Step1 } from "@/components/signup-steps";
import Logo from "@/assets/ivyLight.jpeg";
import { Button } from "@/components/ui/button";

export default function SignUp() {
    // const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<FormSchemaType>({
      resolver: zodResolver(formSchema),
      mode: 'onChange'
    });

    const stepProps = { register, errors, watch, setValue };
    
    const submit: SubmitHandler<FormSchemaType> = async (data) => {
        // e.preventDefault();
        // Handle form submission here
        try {
            delete (data as Partial<FormSchemaType>).confirmPassword
            setIsLoading(true)
    
            const userData: SignUpData = {
              ...data,
              role: 'student'
            }
            console.log('userData', userData)
    
            toast({
                title: "Welcome to Petty Shelter.",
                description: "Thank you for joining our mission at Petty Shelter! We are so excited to have you as part of our community. Before we can start sending you updates on the adorable pets waiting for their forever homes, we need you to confirm your email address."
            })
            setIsLoading(false)
    
        } catch (error: unknown) {
            console.error('error', error)
            setError('Something went wrong. Please try again later.');
    
            toast({
                variant: 'destructive',
                title: "Oops!", 
                description: JSON.stringify(error)
            })
            setIsLoading(false)
        }
        // console.log('Form submitted:', data);
    };
    
    return (
      <div className={`bg-greybg-light-gradient bg-cover bg-center bg-no-repeat flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-cyan-500/20`}>
        <Card className="min-[641px]:min-w-[640px] mx-auto">
          <CardHeader className="py-3">
            <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Create your account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center pb-3">
            <div className="max-[640px]:flex hidden items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <UsersRound className="size-4" />
              </div>
              <span className="truncate text-xl font-semibold">IVY LEAGUE ASSOCIATES</span>
            </div>
            <div className="max-[640px]:hidden flex sm:w-full sm:h-full sm:max-w-sm">
              <img src={Logo} alt="Ivy League" className="w-80 h-80 mx-auto logo" />
            </div>

            <div className="max-[640px]:mt-8 sm:w-full sm:max-w-sm">

                <form onSubmit={handleSubmit(submit)} className="space-y-6">
                    <Step1 {...stepProps} />
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error:</strong> {error}
                        </div>
                    )}

                    <div className="flex justify-between mt-3">
                        <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading || !isValid}
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
            <p className="text-center text-sm/6 text-gray-500">
                Already have an account?{' '}
                <Link to="/accounts/signin" className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50">
                  Sign in
                </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
}