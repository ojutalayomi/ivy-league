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
import { Check, ChevronLeft, Loader2 } from "lucide-react";

const formSchema = z.object({
  accaRegNumber: z.string().min(1, "ACCA registration number is required"),
  correspondenceAddress: z.string().min(1, "Correspondence address is required"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  oxfordBrookes: z.string().min(1, "Please indicate your interest in Oxford Brookes BSc Program"),
  referralSource: z.string().min(1, "Please select how you heard about us"),
  referredBy: z.string().optional(),
  consentUpload: z.string().min(1, "Please provide consent for uploading your details"),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions"
  })
});

type FormData = z.infer<typeof formSchema>;

const sponsorSchema = z.object({
    sponsorCode: z.string().min(1, "Sponsor code is required"),
    sponsorName: z.string().min(1, "Organization name is required"),
    sponsorEmail: z.string().email("Please enter a valid email address")
});

type SponsorData = z.infer<typeof sponsorSchema>;

const STORAGE_KEY = 'additional_info_draft';

export default function AdditionalInfo() {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: (() => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : {
        accaRegNumber: '',
        correspondenceAddress: '',
        employmentStatus: '',
        oxfordBrookes: '',
        referralSource: '',
        referredBy: '',
        consentUpload: '',
        termsAgreed: false
      };
    })()
  });

    useEffect(() => {
      document.title = "Additional Info - Ivy League Associates";
    calculateProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch()]);

  useEffect(() => {
    // Save to localStorage whenever form data changes
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.getValues()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch()]);

  const calculateProgress = () => {
    const values = form.getValues();
    const totalFields = 8;
    const filledFields = Object.entries(values).filter(([key, value]) => {
      if (key === 'termsAgreed') return value === true;
      return value !== '';
    }).length;
    setProgress((filledFields / totalFields) * 100);
  };

  const onSubmit = () => {
    toast({
      title: "Success",
      description: "Additional information submitted successfully"
    });
    // Clear the saved draft
    // localStorage.removeItem(STORAGE_KEY);
    setSearchParams({
      step: 'sponsor'
    });
  };

  const handleClearForm = () => {
    form.reset({
      accaRegNumber: '',
      correspondenceAddress: '',
      employmentStatus: '',
      oxfordBrookes: '',
      referralSource: '',
      referredBy: '',
      consentUpload: '',
      termsAgreed: false
    });
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
                <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent className="flex max-[640px]:flex-wrap gap-8 items-start justify-center">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="accaRegNumber" className="font-semibold">ACCA Registration Number</Label>
                            <Input
                            id="accaRegNumber"
                            placeholder="Enter 001 if you have not registered yet"
                            {...form.register('accaRegNumber')}
                            className="w-full"
                            />
                            {form.formState.errors.accaRegNumber && (
                            <p className="text-sm text-red-500">{form.formState.errors.accaRegNumber.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="correspondenceAddress" className="font-semibold">Correspondence Address</Label>
                            <Textarea
                            id="correspondenceAddress"
                            placeholder="Enter your correspondence address"
                            {...form.register('correspondenceAddress')}
                            className="min-h-[100px]"
                            />
                            {form.formState.errors.correspondenceAddress && (
                            <p className="text-sm text-red-500">{form.formState.errors.correspondenceAddress.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label className="font-semibold">Employment Status</Label>
                            <RadioGroup
                            value={form.watch('employmentStatus')}
                            onValueChange={(value) => form.setValue('employmentStatus', value)}
                            className="grid gap-3 bg-blue-50 dark:bg-muted/20 rounded-lg p-4"
                            >
                            {["Graduate expecting to join the workforce", "Undergraduate", "Fully/Self employed"].map((status) => (
                                <div key={status} className="flex items-center space-x-3">
                                <RadioGroupItem value={status} id={`status-${status}`} />
                                <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
                                </div>
                            ))}
                            </RadioGroup>
                            {form.formState.errors.employmentStatus && (
                            <p className="text-sm text-red-500">{form.formState.errors.employmentStatus.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label className="font-semibold">Are you interested in Oxford Brookes BSc Program?</Label>
                            <RadioGroup
                            value={form.watch('oxfordBrookes')}
                            onValueChange={(value) => form.setValue('oxfordBrookes', value)}
                            className="flex gap-6 bg-blue-50 dark:bg-muted/20 rounded-lg p-4"
                            >
                            {["Yes", "No", "Maybe"].map((option) => (
                                <div key={option} className="flex items-center space-x-3">
                                <RadioGroupItem value={option} id={`oxford-${option}`} />
                                <Label htmlFor={`oxford-${option}`} className="text-sm">{option}</Label>
                                </div>
                            ))}
                            </RadioGroup>
                            {form.formState.errors.oxfordBrookes && (
                            <p className="text-sm text-red-500">{form.formState.errors.oxfordBrookes.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label className="font-semibold">How did you know about us?</Label>
                            <RadioGroup
                            value={form.watch('referralSource')}
                            onValueChange={(value) => form.setValue('referralSource', value)}
                            className="grid gap-3 bg-blue-50 dark:bg-muted/20 rounded-lg p-4"
                            >
                            {["Friends", "ACCA's website", "Our social media platforms", "Online Ads", "Flyer"].map((source) => (
                                <div key={source} className="flex items-center space-x-3">
                                <RadioGroupItem value={source} id={`source-${source}`} />
                                <Label htmlFor={`source-${source}`} className="text-sm">{source}</Label>
                                </div>
                            ))}
                            </RadioGroup>
                            {form.formState.errors.referralSource && (
                            <p className="text-sm text-red-500">{form.formState.errors.referralSource.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="referredBy" className="font-semibold">Referred by a friend?</Label>
                            <Input
                            id="referredBy"
                            placeholder="Enter friend's full name & phone number"
                            {...form.register('referredBy')}
                            className="w-full"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="font-semibold">Consent to upload details on ACCA-ALP web page</Label>
                            <RadioGroup
                            value={form.watch('consentUpload')}
                            onValueChange={(value) => form.setValue('consentUpload', value)}
                            className="flex gap-6 bg-blue-50 dark:bg-muted/20 rounded-lg p-4"
                            >
                            {["Agreed", "Disagreed"].map((option) => (
                                <div key={option} className="flex items-center space-x-3">
                                <RadioGroupItem value={option} id={`consent-${option}`} />
                                <Label htmlFor={`consent-${option}`} className="text-sm">{option}</Label>
                                </div>
                            ))}
                            </RadioGroup>
                            {form.formState.errors.consentUpload && (
                            <p className="text-sm text-red-500">{form.formState.errors.consentUpload.message}</p>
                            )}
                        </div>

                        <div className="bg-blue-50 dark:bg-muted/20 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                            <Checkbox
                                id="terms"
                                checked={form.watch('termsAgreed')}
                                onCheckedChange={(checked) => form.setValue('termsAgreed', checked as boolean)}
                            />
                            <div className="space-y-1">
                                <Label htmlFor="terms" className="text-sm font-medium">
                                Terms and Conditions
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                By submitting this you confirm that you have read and agreed to our{' '}
                                <a
                                    href="https://ivyleaguenigeria.com/terms-and-conditions/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    Terms and Conditions
                                </a>
                                </p>
                            </div>
                            </div>
                            {form.formState.errors.termsAgreed && (
                            <p className="text-sm text-red-500 mt-2">{form.formState.errors.termsAgreed.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={!form.watch('termsAgreed') || !form.formState.isValid} className="bg-cyan-500 hover:bg-cyan-400 text-white flex-1 font-semibold">
                            Submit Information
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
          <DialogFooter>
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
            navigate('/student-dashboard/courses/register');
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
            
            setTimeout(() => {
                setSuccess(true);
            }, 3000);
            
            setTimeout(() => {
                setIsLoading(false);
                setSuccess(false);
                navigate("/student-dashboard/courses/view")
            }, 5000);
        } catch (error) {
            console.error('Validation error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again."
            });
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
                    onClick={() => isSponsor ? handleSubmit() : navigate('/student-dashboard/courses/register')}
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
            navigate('/student-dashboard/courses/register');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);
    
    return countdown > 0 ? countdown + (countdown > 1 ? " seconds" : " second") : "0 seconds";
}