import * as z from 'zod';

export type User = {
    avatar: string;
    id: string;
    name: string;
    email: string;
    preferences: UserPreferences;
    role: 'admin' | 'user';
    token: string;
    username: string;
    verificationStatus: UserVerificationStatus;
    accountDetails: UserAccountDetails;
    paymentDetails: UserPaymentDetails;
}

export type UserType = 'intensive' | 'standard'

export type Student = {
    registrationNumber: string;
    name: string;
    email: string;
    dateOfBirth: string;
    newStudent: boolean;
    papers: string[];
    revision: boolean;
    totalFee: number;
    gender: 'male' | 'female' | 'other';
    preferences: UserPreferences;
    role: 'student';
    type: UserType;
    paymentDetails: UserPaymentDetails;
}

export type UserPreferences = {
    level: 'beginner' | 'intermediate' | 'advanced';
    paymentMethod: 'creditCard' | 'paypal' | 'bankTransfer';
    currency: 'USD' | 'EUR' | 'GBP';
    language: 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh' | 'ko' | 'ru' | 'pt' | 'ar';
    theme: 'light' | 'dark';
    notifications: 'enabled' | 'disabled';
    emailUpdates: 'enabled' | 'disabled';
    emailFrequency: 'daily' | 'weekly' | 'monthly';
    emailLanguage: 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh' | 'ko' | 'ru' | 'pt' | 'ar';
    emailTime: 'morning' | 'afternoon' | 'evening';
}

export type UserVerificationStatus = {
    email: 'verified' | 'unverified';
    phone: 'verified' | 'unverified';
    address: 'verified' | 'unverified';
    identity: 'verified' | 'unverified';
}

export type UserAccountDetails = {
    accountType: 'free' | 'premium';
    subscriptionStatus: 'active' | 'inactive';
    subscriptionStartDate: string;
    subscriptionEndDate: string;
}

export type UserPaymentDetails = {
    paymentMethod: 'creditCard' | 'paypal' | 'bankTransfer';
    paymentStatus: 'active' | 'inactive';
    paymentStartDate: string;
    paymentEndDate: string;
}

export type SignUpData = {
    firstName: string;
    lastName: string;
    role: 'admin' | 'student';
    email: string;
    dob: string;
    phoneNumber: string;
    password: string;
}

export const formSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    dob: z.string({
        required_error: "A date of birth is required.",
    }),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
  
  export type FormSchemaType = z.infer<typeof formSchema>;
  export type FormStep = 1 | 2 | 3;