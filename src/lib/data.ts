import { Student } from "./types";

export const students: Student[] = [
    {
        registrationNumber: "2024001",
        name: "John Doe",
        email: "john.doe@example.com",
        dateOfBirth: "1998-03-15",
        newStudent: true,
        papers: ["Mathematics", "Physics"],
        revision: false,
        totalFee: 1500,
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
        type: "intensive",
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
        dateOfBirth: "1999-07-22",
        newStudent: false,
        papers: ["Chemistry", "Biology"],
        revision: true,
        totalFee: 1200,
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
        type: "standard",
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
        dateOfBirth: "1997-11-30",
        newStudent: true,
        papers: ["Computer Science", "Mathematics"],
        revision: false,
        totalFee: 1700,
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
        type: "intensive",
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
        dateOfBirth: "2000-01-15",
        newStudent: false,
        papers: ["Literature", "History"],
        revision: true,
        totalFee: 1300,
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
        type: "standard",
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
        dateOfBirth: "1998-09-20",
        newStudent: true,
        papers: ["Physics", "Chemistry"],
        revision: false,
        totalFee: 1600,
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
        type: "intensive",
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
        dateOfBirth: "1999-04-05",
        newStudent: false,
        papers: ["Biology", "Chemistry"],
        revision: true,
        totalFee: 1400,
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
        type: "standard",
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
        dateOfBirth: "1997-12-10",
        newStudent: true,
        papers: ["Mathematics", "Computer Science"],
        revision: false,
        totalFee: 1800,
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
        type: "intensive",
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
        dateOfBirth: "2000-03-25",
        newStudent: false,
        papers: ["History", "Literature"],
        revision: true,
        totalFee: 1250,
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
        type: "standard",
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
        dateOfBirth: "1998-06-18",
        newStudent: true,
        papers: ["Physics", "Mathematics"],
        revision: false,
        totalFee: 1650,
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
        type: "intensive",
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
        dateOfBirth: "1999-08-30",
        newStudent: false,
        papers: ["Chemistry", "Biology"],
        revision: true,
        totalFee: 1350,
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
        type: "standard",
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
        dateOfBirth: "1998-02-14",
        newStudent: true,
        papers: ["Computer Science", "Physics"],
        revision: false,
        totalFee: 1750,
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
        type: "intensive",
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
        dateOfBirth: "2000-05-20",
        newStudent: false,
        papers: ["Literature", "History"],
        revision: true,
        totalFee: 1280,
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
        type: "standard",
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
        dateOfBirth: "1997-10-08",
        newStudent: true,
        papers: ["Mathematics", "Chemistry"],
        revision: false,
        totalFee: 1680,
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
        type: "intensive",
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
        dateOfBirth: "1999-12-03",
        newStudent: false,
        papers: ["Biology", "Physics"],
        revision: true,
        totalFee: 1420,
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
        type: "standard",
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
        dateOfBirth: "1998-07-17",
        newStudent: true,
        papers: ["Computer Science", "Mathematics"],
        revision: false,
        totalFee: 1580,
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
        type: "intensive",
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
        dateOfBirth: "2000-09-12",
        newStudent: false,
        papers: ["History", "Literature"],
        revision: true,
        totalFee: 1320,
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
        type: "standard",
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
        dateOfBirth: "1997-04-25",
        newStudent: true,
        papers: ["Physics", "Chemistry"],
        revision: false,
        totalFee: 1720,
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
        type: "intensive",
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
        dateOfBirth: "1999-11-08",
        newStudent: false,
        papers: ["Biology", "Chemistry"],
        revision: true,
        totalFee: 1380,
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
        type: "standard",
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
        dateOfBirth: "1998-01-30",
        newStudent: true,
        papers: ["Mathematics", "Computer Science"],
        revision: false,
        totalFee: 1620,
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
        type: "intensive",
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
        dateOfBirth: "2000-06-15",
        newStudent: false,
        papers: ["Literature", "History"],
        revision: true,
        totalFee: 1290,
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
        type: "standard",
        paymentDetails: {
            paymentMethod: "paypal",
            paymentStatus: "active",
            paymentStartDate: "2024-01-01",
            paymentEndDate: "2024-12-31"
        }
    }
];