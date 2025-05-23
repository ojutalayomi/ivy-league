import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, Loader2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

interface Question {
    key: string;
    subject: string;
    more_info: string;
    type: 'short answer' | 'long answer' | 'checkboxes' | 'multiple choice' | 'terms';
    options: string[];
}

// const formSchema = z.object({
//   accaRegNumber: z.string().min(1, "ACCA registration number is required"),
//   correspondenceAddress: z.string().min(1, "Correspondence address is required"),
//   employmentStatus: z.string().min(1, "Employment status is required"),
//   oxfordBrookes: z.string().min(1, "Please indicate your interest in Oxford Brookes BSc Program"),
//   referralSource: z.string().min(1, "Please select how you heard about us"),
//   referredBy: z.string().optional(),
//   consentUpload: z.string().min(1, "Please provide consent for uploading your details"),
//   termsAgreed: z.boolean().refine((val) => val === true, {
//     message: "You must agree to the terms and conditions"
//   })
// });

type FormData = z.infer<z.ZodObject<z.ZodRawShape>>;

const sponsorSchema = z.object({
    sponsorCode: z.string().min(1, "Sponsor code is required"),
    sponsorName: z.string().min(1, "Organization name is required"),
    sponsorEmail: z.string().email("Please enter a valid email address")
});

type SponsorData = z.infer<typeof sponsorSchema>;

const STORAGE_KEY = 'additional_info_draft';

export default function AdditionalInfo() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formSchema, setFormSchema] = useState<z.ZodObject<z.ZodRawShape>>(z.object({}));
  const [error, setError] = useState<boolean>(false);

  // Create form schema based on questions
  useEffect(() => {
    if (questions.length > 0) {
      const schemaFields: { [key: string]: z.ZodTypeAny } = {};
      
      questions.forEach((question) => {
        const fieldName = question.key;
        if (question.subject.includes("Referred by a friend")) {
            schemaFields[fieldName] = z.string().optional();
        } else if (question.type === 'terms') {
          schemaFields[fieldName] = z.boolean().refine((val) => val === true, {
            message: "You must agree to the terms and conditions"
          });
        } else {
          schemaFields[fieldName] = z.string().min(1, `${question.subject} is required`);
        }
      });

      setFormSchema(z.object(schemaFields));
    }
  }, [questions]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: (() => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : {};
    })()
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/required-info?api-key=AyomideEmmanuel&title=reg_form_info');
        setQuestions(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(true);
      }
    };
    if (questions.length === 0 && isLoading) fetchQuestions();
  }, []);

  useEffect(() => {
    document.title = "Additional Info - Ivy League Associates";
    calculateProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch()]);

  useEffect(() => {
    // Save to localStorage whenever form data changes
    // console.log(form.getValues());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.getValues()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch()]);

  const calculateProgress = () => {
    const values = form.getValues();
    const totalFields = questions.length;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filledFields = Object.entries(values).filter(([_, value]) => {
      if (typeof value === 'boolean') return value === true;
      return value !== '';
    }).length;
    setProgress((filledFields / totalFields) * 100);
  };

  const renderFormField = (question: Question, index: number) => {
    const fieldName = question.key;

    switch (question.type) {
      case 'short answer':
        return (
          <div key={index} className="grid gap-2">
            <Label htmlFor={fieldName} className="font-semibold">{question.subject}</Label>
            <Input
              id={fieldName}
              placeholder={question.more_info}
              {...form.register(fieldName)}
              className="w-full"
            />
            {form.formState.errors[fieldName] && (
              <p className="text-sm text-red-500">{form.formState.errors[fieldName]?.message as string}</p>
            )}
          </div>
        );

      case 'long answer':
        return (
          <div key={index} className="grid gap-2">
            <Label htmlFor={fieldName} className="font-semibold">{question.subject}</Label>
            <Textarea
              id={fieldName}
              placeholder={question.more_info}
              {...form.register(fieldName)}
              className="min-h-[100px]"
            />
            {form.formState.errors[fieldName] && (
              <p className="text-sm text-red-500">{form.formState.errors[fieldName]?.message as string}</p>
            )}
          </div>
        );

      case 'multiple choice':
      case 'checkboxes':
        return (
          <div key={index} className="grid gap-2">
            <Label className="font-semibold">{question.subject}</Label>
            <RadioGroup
              value={form.watch(fieldName)}
              onValueChange={(value) => form.setValue(fieldName, value)}
              className="grid gap-3 bg-blue-50 dark:bg-muted/20 rounded-lg p-4"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={`${fieldName}-${option}`} />
                  <Label htmlFor={`${fieldName}-${option}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {form.formState.errors[fieldName] && (
              <p className="text-sm text-red-500">{form.formState.errors[fieldName]?.message as string}</p>
            )}
          </div>
        );

      case 'terms':
        return (
          <div key={index} className="bg-blue-50 dark:bg-muted/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={fieldName}
                checked={form.watch(fieldName)}
                onCheckedChange={(checked) => form.setValue(fieldName, checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor={fieldName} className="text-sm font-medium">
                  {question.subject}
                </Label>
                {question.more_info && (
                  <p className="text-sm text-muted-foreground">
                    <a
                      href={question.more_info}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Terms and Conditions
                    </a>
                  </p>
                )}
              </div>
            </div>
            {form.formState.errors[fieldName] && (
              <p className="text-sm text-red-500 mt-2">{form.formState.errors[fieldName]?.message as string}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmit = async () => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields correctly"
        });
        return;
      }

      setIsLoading(true);
      toast({
        title: "Success",
        description: "Additional information submitted successfully"
      });
      
      setIsLoading(false);
      setSearchParams({
        step: 'sponsor'
      });
    } catch (error) {
      if (error instanceof Error) {
        const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error;
        // console.log(message);
        const [title, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred'];
        toast({
          variant: 'destructive',
          title: title || 'Error',
          description: description || 'An unexpected error occurred'
        });
      } else {
        console.error('Unexpected error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An unexpected error occurred'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    form.reset({});
    localStorage.removeItem(STORAGE_KEY);
    setShowClearDialog(false);
    toast({
      title: "Form Reset",
      description: "All form data has been cleared"
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
      {searchParams.get('step') === 'sponsor' ? <SponsorCard form={form} /> : (
        <Card className="min-[641px]:min-w-[640px] mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">
              Additional Information
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Please provide the following details to complete your registration
            </CardDescription>
            {!isLoading && !error && <Progress value={progress} className="mt-4" />}
          </CardHeader>
          <CardContent className="flex max-[640px]:flex-wrap gap-8 items-start justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="size-10 animate-spin" />
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center">
                <XCircle className="size-10 text-red-500" />
                <p className="text-muted-foreground">Failed to load form questions</p>
              </div>
            ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <div className="grid gap-6">
                {questions.map((question, index) => renderFormField(question, index))}
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={!form.formState.isValid} 
                  className="bg-cyan-500 hover:bg-cyan-400 text-white flex-1 font-semibold"
                >
                  {isLoading ? "Submitting..." : "Submit Information"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowClearDialog(true)}
                >
                  Clear Form
                </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all form data? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearForm}>
              Clear Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const SponsorCard = ({ form }: { form: UseFormReturn<FormData> }) => {
    const navigate = useNavigate();
    const [isSponsor, setIsSponsor] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { toast } = useToast();

    const sponsorForm = useForm<SponsorData>({
        resolver: zodResolver(sponsorSchema),
        defaultValues: {
            sponsorCode: '',
            sponsorName: '',
            sponsorEmail: ''
        }
    });

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async () => {
        if (!isSponsor) {
            navigate('/student-dashboard/papers/register');
            return;
        }

        try {
            const isValid = await sponsorForm.trigger();
            if (!isValid) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Please fill in all required sponsor fields correctly"
                });
                return;
            }

            setIsLoading(true);
            const data = sponsorForm.getValues();
            
            // TODO: Submit sponsor information
            console.log('Sponsor data:', data);
            const response = await api.post('/required-info?api-key=AyomideEmmanuel', data)

            if (response.status === 200) {
              toast({
                title: "You have signed in succesfully.",
                description: JSON.stringify(data)
              })
            
              setSuccess(true);
              
              setTimeout(() => {
                  setIsLoading(false);
                  setSuccess(false);
                  navigate("/student-dashboard/papers/register")
              }, 3000);
            }
        } catch (error) {
            if (error instanceof Error) {
                const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
                console.log(message)
                const [title, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
                toast({
                    variant: 'destructive',
                    title: title || 'Error',
                    description: description || 'An unexpected error occurred'
                })
            } else if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response: { data: { error: string } } }
                console.error('API Error:', axiosError.response.data.error)
                toast({
                    variant: 'destructive',
                    title: 'API Error',
                    description: axiosError.response.data.error
                })
            } else {
                console.error('Unexpected error:', error)
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'An unexpected error occurred'
                })
            }
        }
    };
    
    return (
        <Card className="min-[641px]:min-w-[640px] mx-auto">
          <CardHeader>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <CardTitle>Sponsor Information</CardTitle>
                        <CardDescription>
                            Please provide your sponsor details if applicable
                        </CardDescription>
                    </div>
                </div>
          </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="space-y-4">
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

                    <div className="space-y-4 bg-blue-50 max-w-lg mx-auto dark:bg-muted/20 dark:border rounded-lg transition-all p-4">
                    {isSponsor ? (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="sponsorCode" className="font-semibold">Sponsor Code</Label>
                                <Input
                                    id="sponsorCode"
                                    placeholder="Enter your sponsor code"
                                    className="w-full"
                                    {...sponsorForm.register('sponsorCode')}
                                />
                                {sponsorForm.formState.errors.sponsorCode && (
                                    <p className="text-sm text-red-500">{sponsorForm.formState.errors.sponsorCode.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sponsorName" className="font-semibold">Sponsor Organization</Label>
                                <Input
                                    id="sponsorName"
                                    placeholder="Enter sponsor organization name"
                                    className="w-full"
                                    {...sponsorForm.register('sponsorName')}
                                />
                                {sponsorForm.formState.errors.sponsorName && (
                                    <p className="text-sm text-red-500">{sponsorForm.formState.errors.sponsorName.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sponsorEmail" className="font-semibold">Sponsor Email</Label>
                                <Input
                                    id="sponsorEmail"
                                    type="email"
                                    placeholder="Enter sponsor contact email"
                                    className="w-full"
                                    {...sponsorForm.register('sponsorEmail')}
                                />
                                {sponsorForm.formState.errors.sponsorEmail && (
                                    <p className="text-sm text-red-500">{sponsorForm.formState.errors.sponsorEmail.message}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <span>You have chosen to skip the sponsor information. You will be redirected to the course registration page in <CountdownTimer />.</span>
                    )}
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={!form.watch('termsAgreed')} 
                    className="bg-cyan-500 hover:bg-cyan-400 max-w-lg mx-auto flex-1 font-semibold" 
                    onClick={() => isSponsor ? handleSubmit() : navigate('/student-dashboard/papers/register')}
                >
                    {isSponsor ? (
                        <>
                            <span className="font-semibold">
                                {isLoading ? "Submitting..." : "Submit Information"}
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
            </CardContent>
        </Card>
    );
};

const CountdownTimer = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            navigate('/student-dashboard/papers/register');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);
    
    return countdown > 0 ? countdown + (countdown > 1 ? " seconds" : " second") : "0 seconds";
}