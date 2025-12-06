import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateUserProfile } from "@/redux/userSlice";
import { setAllowPaperRegistration } from "@/redux/utilsSlice";

const sponsorSchema = z.object({
  sponsorCode: z.string().min(1, "Sponsor code is required"),
});

type SponsorData = z.infer<typeof sponsorSchema>;

const STORAGE_KEY = 'additional_info_draft';

const SponsorCard = ({hideBackButton, hideSponsor}: {hideBackButton?: boolean, hideSponsor?: boolean}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate();
  const [isSponsor, setIsSponsor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isError, setIsError] = useState('');
  const [scholarship, setScholarship] = useState<string[]>([]);
  const [fee, setFee] = useState<string[]>([]);
  const location = useLocation();
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);

  const [dietOptions, setDietOptions] = useState<{
    available: boolean,
    diet_name: string,
    message: string,
    diet_ends: string,
    reg_ends: string
  }[]>([]);

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const response = await api.get('/diets');
        setDietOptions(response.data);
      } catch (error) {
        console.error('Error fetching diets:', error);
        toast.error("Failed to fetch diets");
      }
    };
    fetchDiets();
  }, []);

  useEffect(() => {
    if (selectedDiet) {
      localStorage.setItem('selectedDiet', selectedDiet);
    }
  }, [selectedDiet])

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/courses?reg=true' + (user.user_status === 'student' ? '' : "&acca_reg=001") + '&user_status='+user.user_status+'&email='+user.email);
        setScholarship(response.data.scholarship);
        setFee(response.data.fee);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching papers:', error);
        // setError(true);
      }
    };
    if (isLoading) fetchDetails();
  }, [isLoading, user.email, user.user_status]);

  const sponsorForm = useForm<SponsorData>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      sponsorCode: '',
    }
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    try {
      const isValid = await sponsorForm.trigger();
      if (!isValid && isSponsor) {
        toast.error("Validation Error",{
          description: "Please fill in all required sponsor fields correctly"
        });
        return;
      }
      setIsError('');
      setIsLoading(true);
      const data = sponsorForm.getValues();
      
      // TODO: Submit sponsor information
      // console.log('Sponsor data:', data);
      const additionalInfo = localStorage.getItem(STORAGE_KEY);
      const response = await api.post('/register', {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        reg_no: user.reg_no,
        user_status: user.user_status,
        sponsored: isSponsor,
        token: data.sponsorCode, 
        diet: selectedDiet || '',
        user_data: {
          discount: [],
          discount_papers: [], 
          ...(user.user_status === 'signee' && additionalInfo ? JSON.parse(additionalInfo) : {}),
          scholarship_used: scholarship,
        },
        fee: fee
      })

      if (response.status >= 200 && response.status < 300) {
        toast.success("Your registration is complete.",{
          description: "You can proceed to view your sponsored papers.",
        })

        dispatch(updateUserProfile({
          user_status: response.data.user_status || 'student',
          reg_no: response.data.reg_no || user.reg_no,
          acca_reg: response.data.acca_reg || '001',
          fee: response.data.fee || [],
          scholarship: response.data.scholarship || [],
          papers: response.data.papers || []
        }));
      
        setSuccess(true);
        
        setTimeout(() => {
          setIsLoading(false);
          setSuccess(false);
          if (!isSponsor) {
            navigate("/papers/register");
          } else {
            navigate("/papers/view");
          }
        }, 3000);
      }
    } catch (error) {
      setSuccess(false);
      if (error instanceof Error) {
        const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error;
          
        const [title, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
        setIsError(title.includes('Initialization Error') ? 'An unexpected error occurred' : description);
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } }
        console.error('API Error:', axiosError.response.data.error)
        setIsError(axiosError.response.data.error);
      } else {
        console.error('Unexpected error:', error)
        setIsError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    dispatch(setAllowPaperRegistration(true));
    navigate('/papers/register');
  };
  
  return (
    <Card className="min-[641px]:min-w-[640px] mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          {!hideBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Please provide your additional information if applicable
            </CardDescription>
          </div>
        </div>
      </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {/* Company Branding */}
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-cyan-400">IVY League Associates</h2>
            <div className="w-16 h-0.5 bg-cyan-400 mx-auto mt-2"></div>
          </div>

          <div className="space-y-4">
            {!location.pathname.includes('/papers') && (
              <div className="flex flex-col items-center space-y-2">
                <Label className="font-semibold">Are you sponsored by an organization?</Label>
                <div className="flex justify-between items-center gap-2 bg-blue-50 dark:bg-muted/20 dark:border p-1 rounded-full max-w-md">
                  <Button 
                      data-state={isSponsor ? 'checked' : 'unchecked'}
                      onClick={() => setIsSponsor(true)}
                      className={cn(
                          "flex gap-1 items-center flex-1 py-2 px-4 rounded-full transition-all duration-200",
                          isSponsor 
                              ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-sm font-medium" 
                              : "bg-transparent shadow-none text-muted-foreground hover:bg-cyan-400/10"
                      )}
                  >
                      Yes
                      {isSponsor && <Check className='w-4 h-4' />}
                  </Button>
                  <Button
                      data-state={!isSponsor ? 'checked' : 'unchecked'}
                      onClick={() => setIsSponsor(false)}
                      className={cn(
                          "flex gap-1 items-center flex-1 py-2 px-4 rounded-full transition-all duration-200",
                          !isSponsor 
                              ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-sm font-medium" 
                              : "bg-transparent shadow-none text-muted-foreground hover:bg-cyan-400/10"
                      )}
                  >
                      No
                      {!isSponsor && <Check className='w-4 h-4' />}
                  </Button>
                </div>
              </div>
            )}

            {!hideSponsor && (
              isSponsor ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="sponsorCode" className="font-semibold">Sponsor Code</Label>
                    <Input
                      id="sponsorCode"
                      placeholder="Enter your sponsor code"
                      className="w-full px-4 py-3 dark:bg-slate-800 border dark:border-slate-600 rounded-lg dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      {...sponsorForm.register('sponsorCode')}
                    />
                    {sponsorForm.formState.errors.sponsorCode && (
                      <p className="text-sm text-red-500 dark:text-red-500">{sponsorForm.formState.errors.sponsorCode.message}</p>
                    )}
                  </div>
                </>
              ) : (
                <span>You have chosen to skip the sponsor information. You will be redirected to the course registration page in <CountdownTimer callback={handleSkip} />.</span>
              )
            )}
          </div>

          {isError && isSponsor && (
            <div className="flex flex-col items-center justify-center bg-red-500 text-white p-4 rounded-lg mx-auto">
              <p className="dark:text-white">{isError}</p>
            </div>
          )}

          {/* Diet Selection */}
          {(hideSponsor || !isSponsor) && 
            (
              <div className="mb-2">
                <label className="block text-sm font-medium mb-3">
                  Pick a diet (required)
                </label>
                <div className="space-y-3">
                  {dietOptions.sort((a, b) => new Date(a.reg_ends).getTime() - new Date(b.reg_ends).getTime()).map((diet) => (
                    <div
                      key={diet.diet_name}
                      onClick={() => diet.available ? setSelectedDiet(diet.diet_name) : null}
                      className={`p-4 rounded-lg border ${diet.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} transition-all dark:bg-slate-800 hover:border-cyan-400 ${
                        selectedDiet === diet.diet_name
                          ? 'border-cyan-500 ring-1 ring-cyan-500'
                          : 'border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className={`text-cyan-400 font-bold mr-3 ${diet.available ? '' : 'opacity-50'}`}>{diet.diet_name}</span>
                            {/* <h3 className="font-medium dark:text-white">{diet.diet_name}</h3> */}
                          </div>
                          <p className={`text-sm text-gray-400 dark:text-gray-400 mt-2 ml-6 ${diet.available ? '' : 'opacity-50'}`}>
                            {diet.message}
                          </p>
                          <p className={`text-sm text-gray-400 dark:text-gray-400 mt-2 ml-6 ${diet.available ? '' : 'opacity-50'}`}>
                            Diet ends: {diet.diet_ends}
                          </p>
                          <p className={`text-sm text-gray-400 dark:text-gray-400 mt-2 ml-6 ${diet.available ? '' : 'opacity-50'}`}>
                            Registration ends: {diet.reg_ends}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ml-3 mt-0.5 flex-shrink-0 ${diet.available ? '' : 'opacity-50'} ${
                          selectedDiet === diet.diet_name
                            ? 'border-cyan-500 bg-cyan-500'
                            : 'border-slate-500'
                        }`}>
                          {selectedDiet === diet.diet_name && (
                            <Check className="w-2.5 h-2.5 text-white m-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          <Button 
            type="submit" 
            disabled={isSponsor && sponsorForm.watch('sponsorCode') === ''} 
            className="bg-cyan-500 hover:bg-cyan-400 max-w-lg mx-auto flex-1 font-semibold" 
            onClick={async () => isSponsor ? handleSubmit() : await handleSkip()}
          >
            {isSponsor ? (
              <>
                <span className="font-semibold">
                  {isLoading ? "Submitting..." : isSponsor ? "Submit Information" : "Submit and Skip"}
                </span>
                {isLoading && (success ? <Check className='w-4 h-4' /> : <Loader2 className='w-4 h-4 animate-spin' />)}
              </>
            ) : (
              <>
                <span className="flex-1 font-semibold">
                  Skip
                </span>
              </>
            )}
          </Button>

          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              {!selectedDiet && 'Please select a diet option (required)'}
              {!selectedDiet && !dietOptions.some(diet => diet.available) && 'No diet options available'}
              {selectedDiet && isSponsor && !sponsorForm.watch('sponsorCode') && 'Please enter sponsor code'}
              {selectedDiet && (!isSponsor || sponsorForm.watch('sponsorCode')) && 'Ready to skip'}
            </p>
          </div>
        </CardContent>
    </Card>
  );
};

export default SponsorCard;

const CountdownTimer = ( { callback }: { callback?: () => void }) => {
    // const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    
    useEffect(() => {
        const timer = setInterval(() => {
          setCountdown(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
          callback?.();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);
    return countdown > 0 ? countdown + (countdown > 1 ? " seconds" : " second") : "0 seconds";
}