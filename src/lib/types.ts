import * as z from 'zod';

export type User = {
    avatar: string;
    id: string;
    name: string;
    email: string;
    preferences: UserPreferences;
    role: 'admin';
    token: string;
    username: string;
    verificationStatus: UserVerificationStatus;
    accountDetails: UserAccountDetails;
    paymentDetails: UserPaymentDetails;
}

export type UserType = 'all' | 'intensive' | 'standard'

export type Diet = {
    available: boolean;
    title: string;
    diet_name?: string;
    description: string;
    exam_month: string;
    exam_year: string;
    diet_ends: string;
    reg_starts: string;
    reg_ends: string;
    revision_starts: string;
    revision_ends: string;
    revision_deadline?: string;
    papers: string[];
}

// API Paper format (from /courses endpoint)
export type APIPaper = {
    category: string;
    code: string;
    name: string;
    price: number;
}

// Union type to handle both local and API paper formats
export type PaperData = APIPaper | {
    category: string;
    name: string;
    code: string[];
    price: number[];
    revisionPrice?: number;
    type?: ('Standard' | 'Intensive' | '')[]
}

export type Student = {
    registrationNumber: string;
    name: string;
    email: string;
    dateOfBirth: string;
    newStudent: boolean;
    papers: string[];
    gender: 'male' | 'female' | 'other';
    preferences: StudentPreferences;
    role: 'student' | 'admin';
    user_status: "signee" | "student";
    paymentDetails: UserPaymentDetails;
}

export type StudentPreferences = {
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

export type UserPreferences = {
    level: 'beginner' | 'intermediate' | 'advanced';
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
    accountType: 'admin' | 'super-admin';
    accountStatus: 'active' | 'inactive';
    accountCreationDate: string;
}

export type UserPaymentDetails = {
    paymentMethod: 'creditCard' | 'paypal' | 'bankTransfer';
    paymentStatus: 'active' | 'inactive';
    paymentStartDate: string;
    paymentEndDate: string;
}

export type SignUpData = {
    title: 'Mr' | 'Mrs' | 'Miss';
    firstname: string;
    lastname: string;
    role: 'admin' | 'student';
    email: string;
    dob: string;
    phone: string;
    password: string;
    gender: 'male' | 'female'
}
export const formSchema = z.object({
    title: z.enum(['Mr', 'Mrs', 'Miss']),
    firstname: z.string().min(2, 'First name must be at least 2 characters'),
    lastname: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    dob: z.string({
        required_error: "A date of birth is required.",
    }),
    gender: z.enum(['male', 'female']).optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
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