import { Student } from "./types";
import { User } from "./types";

//"Business and Technology(BT), Management Accounting(MA), Financial Accounting(FA), Corporate and Business Law(CBL), Performance Management(PM), Taxation(TAX), Financial Reporting(FR), Audit and Assurance(AA), Financial Management(FM), Strategic Business Leaders(SBL), Strategic Business Reporting(SBR), Advanced Financial Management(AFM), Advanced Performance Management(APM), Advanced Taxation(ATX), Advanced Audit and Assurance(AAA), Oxford Brookes Mentoring(OBU), Diploma in IFRS(DipIFRS)"
export interface Paper {
  category: string;
  name: string;
  code: string;
  price: number;
  revisionPrice?: number;
  type?: 'standard' | 'intensive'
}

export const papers: Paper[] = [
  { category: 'Knowledge Papers', name: 'Business and Technology', code: 'BT', price: 30000, revisionPrice: 10000 },
  { category: 'Knowledge Papers', name: 'Management Accounting', code: 'MA', price: 30000, revisionPrice: 10000 },
  { category: 'Knowledge Papers', name: 'Financial Accounting', code: 'FA', price: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Corporate and Business Law', code: 'CBL', price: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Performance Management', code: 'PM', price: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Taxation', code: 'TAX', price: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Financial Reporting', code: 'FR', price: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Audit and Assurance', code: 'AA', price: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Financial Management', code: 'FM', price: 30000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Strategic Business Leaders', code: 'SBL', price: 45000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Strategic Business Reporting', code: 'SBR', price: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Financial Management', code: 'AFM', price: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Performance Management', code: 'APM', price: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Taxation', code: 'ATX', price: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Audit and Assurance', code: 'AAA', price: 35000, revisionPrice: 10000 },
  { category: 'Additional', name: 'Oxford Brookes Mentoring', code: 'OBU', price: 90000 },
  { category: 'Additional', name: 'Diploma in IFRS', code: 'DipIFRS', price: 75000 },
];

export const papers_ = [
    "Business and Technology(BT)",
    "Management Accounting(MA)",
    "Financial Accounting(FA)",
    "Corporate and Business Law(CBL)",
    "Performance Management(PM)",
    "Taxation(TAX)",
    "Financial Reporting(FR)",
    "Audit and Assurance(AA)",
    "Financial Management(FM)",
    "Strategic Business Leaders(SBL)",
    "Strategic Business Reporting(SBR)",
    "Advanced Financial Management(AFM)",
    "Advanced Performance Management(APM)",
    "Advanced Taxation(ATX)",
    "Advanced Audit and Assurance(AAA)",
    "Oxford Brookes Mentoring(OBU)",
    "Diploma in IFRS(DipIFRS)"
];

export const users: User[] = [
    {
        avatar: "https://example.com/avatar1.jpg",
        id: "user001",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        preferences: {
            level: "advanced",
            language: "en",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "weekly",
            emailLanguage: "en",
            emailTime: "morning"
        },
        role: "admin",
        token: "token123",
        username: "alicej",
        verificationStatus: {
            email: 'unverified',
            phone: 'unverified',
            address: 'verified',
            identity: 'verified'
        },
        accountDetails: {
            accountType: "admin",
            accountStatus: "active",
            accountCreationDate: "2022-01-01"
        },
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2022-01-01",
            paymentEndDate: "2023-01-01"
        }
    },
    {
        avatar: "https://example.com/avatar2.jpg",
        id: "user002",
        name: "Bob Smith",
        email: "bob.smith@example.com",
        preferences: {
            level: "intermediate",
            language: "fr",
            theme: "dark",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "daily",
            emailLanguage: "fr",
            emailTime: "evening"
        },
        role: "admin",
        token: "token456",
        username: "bobsmith",
        verificationStatus: {
            email: 'unverified',
            phone: 'unverified',
            address: 'verified',
            identity: 'verified'
        },
        accountDetails: {
            accountType: "super-admin",
            accountStatus: "active",
            accountCreationDate: "2021-05-15"
        },
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2021-05-15",
            paymentEndDate: "2022-05-15"
        }
    },
    {
        avatar: "https://example.com/avatar3.jpg",
        id: "user003",
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        preferences: {
            level: "beginner",
            language: "en",
            theme: "light",
            notifications: "disabled",
            emailUpdates: "enabled",
            emailFrequency: "monthly",
            emailLanguage: "en",
            emailTime: "afternoon"
        },
        role: "admin",
        token: "token789",
        username: "charlieb",
        verificationStatus: {
            email: 'unverified',
            phone: 'unverified',
            address: 'verified',
            identity: 'verified'
        },
        accountDetails: {
            accountType: "admin",
            accountStatus: "inactive",
            accountCreationDate: "2020-11-20"
        },
        paymentDetails: {
            paymentMethod: "bankTransfer",
            paymentStatus: "inactive",
            paymentStartDate: "2020-11-20",
            paymentEndDate: "2021-11-20"
        }
    }
];

export const students: Student[] = [
    {
        registrationNumber: "2024001",
        name: "John Doe",
        email: "john.doe@example.com",
        dateOfBirth: "1998-03-15T00:00:00.000Z",
        newStudent: true,
        papers: ["Financial Reporting", "Advanced Taxation"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "intermediate",
            paymentMethod: "creditCard",
            currency: "USD",
            language: "en",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "weekly",
            emailLanguage: "en",
            emailTime: "morning"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024002",
        name: "Jane Smith", 
        email: "jane.smith@example.com",
        dateOfBirth: "1999-07-22T00:00:00.000Z",
        newStudent: false,
        papers: ["Strategic Business Leaders", "Advanced Performance Management"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "advanced",
            paymentMethod: "paypal",
            currency: "EUR",
            language: "en",
            theme: "dark",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "daily",
            emailLanguage: "en",
            emailTime: "evening"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024003",
        name: "Michael Johnson",
        email: "michael.j@example.com",
        dateOfBirth: "1997-11-30T00:00:00.000Z",
        newStudent: true,
        papers: ["Business and Technology", "Financial Management"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "beginner",
            paymentMethod: "bankTransfer",
            currency: "GBP",
            language: "en",
            theme: "light",
            notifications: "disabled",
            emailUpdates: "enabled",
            emailFrequency: "monthly",
            emailLanguage: "en",
            emailTime: "afternoon"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "bankTransfer",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024004",
        name: "Emily Brown",
        email: "emily.b@example.com",
        dateOfBirth: "2000-01-15T00:00:00.000Z",
        newStudent: false,
        papers: ["Corporate and Business Law", "Taxation"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "intermediate",
            paymentMethod: "creditCard",
            currency: "USD",
            language: "en",
            theme: "dark",
            notifications: "enabled",
            emailUpdates: "disabled",
            emailFrequency: "weekly",
            emailLanguage: "en",
            emailTime: "morning"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024005",
        name: "David Wilson",
        email: "david.w@example.com",
        dateOfBirth: "1998-09-20T00:00:00.000Z",
        newStudent: true,
        papers: ["Performance Management", "Advanced Audit and Assurance"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "advanced",
            paymentMethod: "paypal",
            currency: "EUR",
            language: "fr",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "daily",
            emailLanguage: "fr",
            emailTime: "evening"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024006",
        name: "Sarah Davis",
        email: "sarah.d@example.com",
        dateOfBirth: "1999-04-05T00:00:00.000Z",
        newStudent: false,
        papers: ["Management Accounting", "Strategic Business Reporting"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "intermediate",
            paymentMethod: "bankTransfer",
            currency: "GBP",
            language: "en",
            theme: "dark",
            notifications: "disabled",
            emailUpdates: "enabled",
            emailFrequency: "monthly",
            emailLanguage: "en",
            emailTime: "afternoon"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "bankTransfer",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024007",
        name: "James Anderson",
        email: "james.a@example.com",
        dateOfBirth: "1997-12-10T00:00:00.000Z",
        newStudent: true,
        papers: ["Financial Accounting", "Audit and Assurance"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "advanced",
            paymentMethod: "creditCard",
            currency: "USD",
            language: "en",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "weekly",
            emailLanguage: "en",
            emailTime: "morning"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024008",
        name: "Emma Taylor",
        email: "emma.t@example.com",
        dateOfBirth: "2000-03-25T00:00:00.000Z",
        newStudent: false,
        papers: ["Oxford Brookes Mentoring", "Diploma in IFRS"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "beginner",
            paymentMethod: "paypal",
            currency: "EUR",
            language: "es",
            theme: "dark",
            notifications: "enabled",
            emailUpdates: "disabled",
            emailFrequency: "daily",
            emailLanguage: "es",
            emailTime: "evening"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024009",
        name: "William Moore",
        email: "william.m@example.com",
        dateOfBirth: "1998-06-18T00:00:00.000Z",
        newStudent: true,
        papers: ["Advanced Financial Management", "Financial Management"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "intermediate",
            paymentMethod: "bankTransfer",
            currency: "GBP",
            language: "en",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "monthly",
            emailLanguage: "en",
            emailTime: "afternoon"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "bankTransfer",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024010",
        name: "Olivia White",
        email: "olivia.w@example.com",
        dateOfBirth: "1999-08-30T00:00:00.000Z",
        newStudent: false,
        papers: ["Strategic Business Leaders", "Advanced Taxation"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "advanced",
            paymentMethod: "creditCard",
            currency: "USD",
            language: "en",
            theme: "dark",
            notifications: "disabled",
            emailUpdates: "enabled",
            emailFrequency: "weekly",
            emailLanguage: "en",
            emailTime: "morning"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024011",
        name: "Lucas Martin",
        email: "lucas.m@example.com",
        dateOfBirth: "1998-02-14T00:00:00.000Z",
        newStudent: true,
        papers: ["Business and Technology", "Performance Management"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "intermediate",
            paymentMethod: "paypal",
            currency: "EUR",
            language: "fr",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "daily",
            emailLanguage: "fr",
            emailTime: "evening"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024012",
        name: "Sophia Clark",
        email: "sophia.c@example.com",
        dateOfBirth: "2000-05-20T00:00:00.000Z",
        newStudent: false,
        papers: ["Corporate and Business Law", "Financial Reporting"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "beginner",
            paymentMethod: "bankTransfer",
            currency: "GBP",
            language: "en",
            theme: "dark",
            notifications: "enabled",
            emailUpdates: "disabled",
            emailFrequency: "monthly",
            emailLanguage: "en",
            emailTime: "afternoon"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "bankTransfer",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024013",
        name: "Henry Thompson",
        email: "henry.t@example.com",
        dateOfBirth: "1997-10-08T00:00:00.000Z",
        newStudent: true,
        papers: ["Management Accounting", "Taxation"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "advanced",
            paymentMethod: "creditCard",
            currency: "USD",
            language: "en",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "weekly",
            emailLanguage: "en",
            emailTime: "morning"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024014",
        name: "Ava Rodriguez",
        email: "ava.r@example.com",
        dateOfBirth: "1999-12-03T00:00:00.000Z",
        newStudent: false,
        papers: ["Advanced Audit and Assurance", "Strategic Business Reporting"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "intermediate",
            paymentMethod: "paypal",
            currency: "EUR",
            language: "es",
            theme: "dark",
            notifications: "disabled",
            emailUpdates: "enabled",
            emailFrequency: "daily",
            emailLanguage: "es",
            emailTime: "evening"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024015",
        name: "Noah Lee",
        email: "noah.l@example.com",
        dateOfBirth: "1998-07-17T00:00:00.000Z",
        newStudent: true,
        papers: ["Financial Accounting", "Advanced Financial Management"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "advanced",
            paymentMethod: "bankTransfer",
            currency: "GBP",
            language: "en",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "monthly",
            emailLanguage: "en",
            emailTime: "afternoon"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "bankTransfer",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024016",
        name: "Isabella Garcia",
        email: "isabella.g@example.com",
        dateOfBirth: "2000-09-12T00:00:00.000Z",
        newStudent: false,
        papers: ["Oxford Brookes Mentoring", "Diploma in IFRS"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "beginner",
            paymentMethod: "creditCard",
            currency: "USD",
            language: "es",
            theme: "dark",
            notifications: "enabled",
            emailUpdates: "disabled",
            emailFrequency: "weekly",
            emailLanguage: "es",
            emailTime: "morning"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024017",
        name: "Mason Martinez",
        email: "mason.m@example.com",
        dateOfBirth: "1997-04-25T00:00:00.000Z",
        newStudent: true,
        papers: ["Advanced Performance Management", "Audit and Assurance"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "intermediate",
            paymentMethod: "paypal",
            currency: "EUR",
            language: "es",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "daily",
            emailLanguage: "es",
            emailTime: "evening"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024018",
        name: "Charlotte Young",
        email: "charlotte.y@example.com",
        dateOfBirth: "1999-11-08T00:00:00.000Z",
        newStudent: false,
        papers: ["Business and Technology", "Financial Management"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "advanced",
            paymentMethod: "bankTransfer",
            currency: "GBP",
            language: "en",
            theme: "dark",
            notifications: "disabled",
            emailUpdates: "enabled",
            emailFrequency: "monthly",
            emailLanguage: "en",
            emailTime: "afternoon"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "bankTransfer",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024019",
        name: "Ethan Scott",
        email: "ethan.s@example.com",
        dateOfBirth: "1998-01-30T00:00:00.000Z",
        newStudent: true,
        papers: ["Corporate and Business Law", "Strategic Business Leaders"],
        user_status: "signee",
        gender: "male",
        preferences: {
            level: "intermediate",
            paymentMethod: "creditCard",
            currency: "USD",
            language: "en",
            theme: "light",
            notifications: "enabled",
            emailUpdates: "enabled",
            emailFrequency: "weekly",
            emailLanguage: "en",
            emailTime: "morning"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "creditCard",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    },
    {
        registrationNumber: "2024020",
        name: "Mia Turner",
        email: "mia.t@example.com",
        dateOfBirth: "2000-06-15T00:00:00.000Z",
        newStudent: false,
        papers: ["Management Accounting", "Advanced Performance Management"],
        user_status: "signee",
        gender: "female",
        preferences: {
            level: "beginner",
            paymentMethod: "paypal",
            currency: "EUR",
            language: "en",
            theme: "dark",
            notifications: "enabled",
            emailUpdates: "disabled",
            emailFrequency: "daily",
            emailLanguage: "en",
            emailTime: "evening"
        },
        role: "student",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    }
];