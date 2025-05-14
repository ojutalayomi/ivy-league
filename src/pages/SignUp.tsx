// import { setCookie, UserList, switchUser } from "@/lib/utils";
// import { useFetchDetails } from "@/providers/fetch-details"
// import { setUser } from "@/redux/userSlice";
// import axios, { AxiosError } from "axios";
import { Loader2, UsersRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { Link /*,useSearchParams*/ } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchemaType, formSchema } from "@/lib/types";
import { Step1 } from "@/components/signup-steps";
import Logo from "@/assets/ivyLight.png";
import LogoDark from "@/assets/ivyDark.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function SignUp() {
    // const dispatch = useDispatch()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<FormSchemaType>({
      resolver: zodResolver(formSchema),
      mode: 'onChange'
    });

    useEffect(() => {
      document.title = "Sign Up - Ivy League Associates";
    }, []);

    const stepProps = { register, errors, watch, setValue };
    
    const submit: SubmitHandler<FormSchemaType> = async (data) => {
        // e.preventDefault();
        // Handle form submission here
        try {
            delete (data as Partial<FormSchemaType>).confirmPassword
            data.gender = data.title === 'Mr' ? 'male' : 'female';
            setIsLoading(true)
            // await new Promise(resolve => setTimeout(resolve, 3000));
            const response = await api.post("/signup?api-key=AyomideEmmanuel", data)

            console.log(response)

            if (response.status !== 200) {
              throw Error(String(Object.entries(response.data.error)[0][1]))
            }
    
            toast({
              variant: 'success',
              title: "Welcome to Ivy League Associates.",
              description: "Thank you for joining Ivy League Associates! We look forward to helping you achieve your academic goals."
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
      <div className={`flex min-h-full flex-1 flex-col items-center justify-center px-6 lg:px-8`}>
        <div className="max-[640px]:flex hidden items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-500 text-white">
            <UsersRound className="size-4" />
          </div>
          <span className="truncate text-xl font-semibold text-white">IVY LEAGUE ASSOCIATES</span>
        </div>
        <Card className="min-[641px]:min-w-[640px] mx-auto bg-transparent dark:bg-transparent border-none shadow-none sm:bg-white dark:sm:bg-gray-900 sm:border sm:shadow">
          <CardHeader className="py-3">
            <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Create your account</CardTitle>
            <CardDescription className="text-center text-white sm:text-primary">Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center p-0 sm:pb-3 sm:px-6">
            <div className="max-[640px]:hidden flex sm:w-full sm:h-full sm:max-w-sm">
              <img src={Logo} alt="Ivy League" className="dark:hidden w-80 h-80 mx-auto" />
              <img src={LogoDark} alt="Ivy League" className="hidden dark:block h-80 mx-auto" />
            </div>

            <div className="sm:w-full sm:max-w-sm">

                <form onSubmit={handleSubmit(submit)} className="space-y-6 p-4 sm:dark:border sm:dark:border-gray-700 rounded-lg">
                    <Step1 {...stepProps} />
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                          <strong className="font-bold">Error:</strong> {error}
                        </div>
                    )}

                    <div className="flex justify-between mt-3">
                      <Button 
                      type="submit" 
                      className="w-full bg-cyan-500 text-white"
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
            <p className="text-center text-sm/6 text-white sm:text-gray-500">
                Already have an account?{' '}
                <Link to="/accounts/signin" className="font-semibold text-cyan-500 hover:text-cyan-400 hover:underline">
                  Sign in
                </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
}