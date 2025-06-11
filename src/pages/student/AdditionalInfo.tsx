import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import SponsorCard from "./Sponsored";

interface Question {
  key: string;
  subject: string;
  more_info: string;
  type: 'short answer' | 'long answer' | 'checkboxes' | 'multiple choice' | 'terms' | 'boolean';
  options: string[];
}

const STORAGE_KEY = 'additional_info_draft';

export default function AdditionalInfo() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
          if (question.key === 'accuracy') {
            schemaFields[fieldName] = z.boolean().refine((val) => val === true, {
              message: "You must select the checkbox"
            });
          } else {
            schemaFields[fieldName] = z.boolean().refine((val) => val === true, {
              message: "You must agree to the terms and conditions"
            });
          }
        } else if (question.type === 'boolean') {
          schemaFields[fieldName] = z.boolean();
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
        const response = await api.get('/required-info?title=reg_form_info');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (questions.length === 0 && !isLoading) fetchQuestions();
  }, [isLoading, questions.length]);

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
      case 'boolean':
        return (
          <div key={index} className="grid gap-2">
            <Label className="font-semibold">{question.subject}</Label>
            <RadioGroup
              value={form.watch(fieldName) === true ? "Agreed" : form.watch(fieldName) === false ? "Disagreed" : ""}
              onValueChange={(value) => form.setValue(fieldName, value === "Agreed")}
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
        title: "Form Saved",
        description: "Additional information saved successfully"
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
      {searchParams.get('step') === 'sponsor' ? <SponsorCard /> : (
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