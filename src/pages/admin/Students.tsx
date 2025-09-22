import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Users, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { EditIcon } from "lucide-react";
import Error404Page from "@/components/404";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { UserState } from "@/redux/userSlice";
import { APIPaper } from "@/lib/types";
import { PaymentHistoryPage } from "../student/Dashboard";

// Column definitions for the data table
const columns: ColumnDef<UserState>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const title = row.original.title;
            return (
                <div className="text-sm">{title || 'N/A'}</div>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
        const student = row.original;
        return (
            <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                {(student.firstname || '').split(' ').map(n => n[0]).join('').toUpperCase()}
                {(student.lastname || '').split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={"data:image/jpeg;base64,"+student.profile_pic || ''} />
            </Avatar>
            <div>
                <div className="font-medium">{student.firstname || ''} {student.lastname || ''}</div>
                <div className="text-sm text-muted-foreground">{student.email || 'N/A'}</div>
            </div>
            </div>
        );
        },
    },
    {
        accessorKey: "reg_no",
        header: "Registration No",
        cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("reg_no") || 'N/A'}</div>
        ),
    },
//   {
//     accessorKey: "preferences.level",
//     header: "Level",
//     cell: ({ row }) => {
//       const level = row.original.preferences.level;
//       const levelColors = {
//         beginner: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
//         intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
//         advanced: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//       };
//       return (
//         <Badge className={levelColors[level]}>
//           {level.charAt(0).toUpperCase() + level.slice(1)}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "papers",
//     header: "Papers",
//     cell: ({ row }) => {
//       const papers = row.getValue("papers") as string[];
//       return (
//         <div className="max-w-[200px]">
//           <div className="text-sm">
//             {papers.length > 2 
//               ? `${papers.slice(0, 2).join(", ")} +${papers.length - 2} more`
//               : papers.join(", ")
//             }
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "paymentDetails.paymentStatus",
//     header: "Payment Status",
//     cell: ({ row }) => {
//       const status = row.original.paymentDetails.paymentStatus;
//       return (
//         <Badge variant={status === "active" ? "default" : "destructive"}>
//           {status === "active" ? "Active" : "Inactive"}
//         </Badge>
//       );
//     },
//   },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
        const student = row.original;
        return (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                <Link to={`/manage-students/students/${student.reg_no}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link to={`/manage-students/students/${student.reg_no}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Student
                </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Student
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        );
        },
    },
];

export const StudentList = () => {
    const { type } = useParams()
    const [filteredData, setFilteredData] = useState<UserState[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      document.title = (type ? type[0].toUpperCase() + type.slice(1) : "All") + " Students - Ivy League Associates";
    }, [type]);

    useEffect(() => {
        const filteredStudents = (value?: string) => {
            if (value && value !== 'all') {
                return filteredData.filter(student => 
                    student.gender === value || 
                    student.papers.find(paper => paper.name === value) ||
                    student.user_status === value
                )
            }
            return filteredData    
        }
        setFilteredData(filteredStudents(type))
    }, [filteredData, type])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await api.get('/list-students?criteria=all');
                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                // Transform API data to match Student type if needed
                const mapped = data.map((item: UserState) => ({
                    title: item.title,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    profile_pic: item.profile_pic,
                    email: item.email,
                    reg_no: item.reg_no,
                    gender: item.gender,
                    newStudent: item.user_status === 'student',
                    dateOfBirth: item.dob,
                    papers: item.papers,
                }));
                setFilteredData(mapped);
            } catch (error) {
                // Optionally, you could set an error state here
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };
        (async () => {
            await fetchStudents();
        })();
    }, []);

    const getTitle = () => {
        switch(type) {
            case 'intensive': return 'Intensive Students'
            case 'standard': return 'Standard Students'
            case 'new': return 'New Students'
            case 'returning': return 'Returning Students'
            case 'female': return 'Female Students'
            case 'male': return 'Male Students'
            case 'other': return 'Other Gender Students'
            default: return 'All Students'
        }
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{getTitle()}</h1>
                    <p className="text-muted-foreground">
                        Manage and view student information
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select defaultValue={type || 'all'} onValueChange={(value) => {
                        const filtered = value === 'all' ? filteredData : filteredData.filter(student => 
                            student.papers.find(paper => paper.name === value) ||
                            student.user_status === value ||
                            student.gender === value
                        )
                        setFilteredData(filtered)
                    }}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder="Filter students" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Students</SelectItem>
                            <SelectItem value="new">New Students</SelectItem>
                            <SelectItem value="returning">Returning Students</SelectItem>
                            <SelectItem value="beginner">Beginner Level</SelectItem>
                            <SelectItem value="intermediate">Intermediate Level</SelectItem>
                            <SelectItem value="advanced">Advanced Level</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <DataTable 
                loading={loading}
                columns={columns} 
                data={filteredData} 
                searchKey="name"
                searchPlaceholder="Search students by name..."
                onBulkDelete={(selectedStudents) => {
                    console.log('Bulk delete students:', selectedStudents);
                    // Implement bulk delete logic here
                }}
                onBulkExport={(selectedStudents) => {
                    console.log('Bulk export students:', selectedStudents);
                    // Implement bulk export logic here
                }}
            />
        </div>
    );
};

export const StudentCard = ({theStudent, filteredData}: {theStudent?: UserState, filteredData?: UserState[]}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const cardRef = useRef<HTMLDivElement>(null)
    const { reg_no } = useParams()
    const [isExpanded, setIsExpanded] = useState(false)
    const [student, setStudent] = useState<UserState | undefined>(undefined)

    useEffect(() => {
        if (location.pathname.includes('view')) setTimeout(() => setIsExpanded(true), 500)
    }, [location.pathname])

    useEffect(() => {
        if (theStudent) setStudent(theStudent)
        else if (reg_no) setStudent(filteredData?.find(student => student.reg_no === reg_no))
        else navigate('/manage-students/students')
    }, [reg_no, theStudent, navigate, filteredData])


    useEffect(() => {
        if (student) document.title = student.firstname + " " + student.lastname + " - Ivy League Associates";
    }, [student, student?.firstname, student?.lastname]);

    useEffect(() => {
        if (isExpanded) cardRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'})
    }, [isExpanded])

    if (!student) return <Error404Page title='Student'/>
    return (
        <Card
            ref={cardRef}
            className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-white via-cyan-50 to-cyan-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start gap-2 min-w-[120px]">
                    <Avatar className="h-20 w-20 border-2 border-cyan-400 shadow-md">
                        <AvatarFallback className="text-lg font-bold bg-cyan-100 dark:bg-gray-800">
                            {(student.firstname || '').split(' ')[0]?.[0] || ''}
                            {(student.lastname || '').split(' ')[0]?.[0] || ''}
                        </AvatarFallback>
                        <AvatarImage src={"data:image/jpeg;base64," + student.profile_pic || ''} />
                    </Avatar>
                    <span className="mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200 shadow">
                        {student.user_status === 'student' ? 'New Student' : 'Returning Student'}
                    </span>
                </div>
                {/* Main Info */}
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-cyan-200 flex items-center gap-2">
                                {student.firstname || ''} {student.lastname || ''}
                                <button
                                    type="button"
                                    className="ml-1 p-1 rounded-full hover:bg-cyan-100 dark:hover:bg-gray-800 transition"
                                    onClick={e => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                                >
                                    {isExpanded ? (
                                        <ChevronUp className="size-5 text-cyan-500" />
                                    ) : (
                                        <ChevronDown className="size-5 text-cyan-500" />
                                    )}
                                </button>
                            </h2>
                            <div className="text-sm text-muted-foreground font-mono">
                                Reg. No: {student.reg_no}
                            </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <Link to={`/manage-students/students/${student.reg_no}`}>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Eye className="size-4" />
                                    <span>View</span>
                                </Button>
                            </Link>
                            <Link to={`/manage-students/students/${student.reg_no}/edit`}>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                    <EditIcon className="size-4" />
                                    <span>Edit</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Expanded Details */}
                    <div
                        className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[1000px] mt-6 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
                        aria-hidden={!isExpanded}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Student Details */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-inner border border-cyan-100 dark:border-gray-800">
                                <h3 className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Personal Details</h3>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    <li>
                                        <span className="font-medium">Gender:</span> {student.gender?.toLocaleUpperCase() || 'N/A'}
                                    </li>
                                    <li>
                                        <span className="font-medium">Date of Birth:</span> {student.dob ? format(new Date(student.dob), 'dd MMM yyyy') : 'N/A'}
                                    </li>
                                    <li>
                                        <span className="font-medium">Email:</span> {student.email || 'N/A'}
                                    </li>
                                </ul>
                            </div>
                            {/* Academic Info */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-inner border border-cyan-100 dark:border-gray-800">
                                <h3 className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Academic Information</h3>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    <li>
                                        <span className="font-medium">Registration Number:</span> {student.reg_no}
                                    </li>
                                    <li>
                                        <span className="font-medium">Papers:</span> {student.papers?.length ? student.papers.join(', ') : 'N/A'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export const StudentView = () => {
    const cardRef = useRef<HTMLDivElement>(null)
    const { reg_no } = useParams()
    const [student, setStudent] = useState<UserState & { date_joined: string, terms: Record<string, string> } | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await api.get('/view-student?reg_no=' + reg_no);
                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                // Transform API data to match Student type if needed
                setStudent(data);
            } catch (error) {
                // Optionally, you could set an error state here
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };
        (async () => {
            await fetchStudents();
        })();
    }, []);


    useEffect(() => {
        if (student?.firstname && student?.lastname) document.title = (student.firstname || '') + " " + (student.lastname || '') + " - Ivy League Associates";
        else document.title = "Student - Ivy League Associates";
    }, [student, student?.firstname, student?.lastname]);

    if (loading) return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )

    if (!student) return <Error404Page title='Student'/>

    return (
        <div className="space-y-6">
            <Card
                ref={cardRef}
                className="border-none shadow-lg bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300"
            >
                <CardContent className="p-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col items-center md:items-start gap-2 min-w-[120px]">
                            <Avatar className="h-20 w-20 border-2 border-cyan-400 shadow-md">
                                <AvatarFallback className="text-lg font-bold bg-cyan-100 dark:bg-gray-800">
                                    {(student.firstname || '').split(' ')[0]?.[0] || ''}
                                    {(student.lastname || '').split(' ')[0]?.[0] || ''}
                                </AvatarFallback>
                                <AvatarImage src={"data:image/jpeg;base64," + (student.profile_pic || '')} />
                            </Avatar>
                            {/* <span className="mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200 shadow">
                                {student.user_status === 'student' ? 'New Student' : 'Returning Student'}
                            </span> */}
                        </div>
                        {/* Main Info */}
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    <h2 className="text-xl font-semibold text-cyan-700 dark:text-cyan-200">
                                        {student.firstname || ''} {student.lastname || ''}
                                    </h2>
                                    <div className="text-sm text-muted-foreground">
                                        {student.reg_no}
                                    </div>
                                </div>
                                <Link to={`/manage-students/students/${student.reg_no}/edit`}>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                        <EditIcon className="size-4" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                {student.email && (
                                    <div>
                                        <span className="font-medium">Email:</span> {student.email}
                                    </div>
                                )}
                                {student.phone_no && (
                                    <div>
                                        <span className="font-medium">Phone:</span> {student.phone_no}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Student Details */}
                        <div>
                            <h3 className="text-base font-semibold mb-2 text-cyan-700 dark:text-cyan-200 flex items-center gap-2">
                                Student Details
                            </h3>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>
                                    <span className="font-medium">Title:</span> {student.title || 'N/A'}
                                </li>
                                <li>
                                    <span className="font-medium">Gender:</span> {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : 'N/A'}
                                </li>
                                <li>
                                    <span className="font-medium">Date of Birth:</span> {student.dob ? format(new Date(student.dob), 'dd MMMM yyyy') : 'N/A'}
                                </li>
                                <li>
                                    <span className="font-medium">Address:</span> {student.address || 'N/A'}
                                </li>
                                <li>
                                    <span className="font-medium">Date Joined:</span> {student.date_joined ? format(new Date(student.date_joined), 'dd MMMM yyyy') : 'N/A'}
                                </li>
                            </ul>
                        </div>
                        {/* Academic Information */}
                        <div>
                            <h3 className="text-base font-semibold mb-2 text-cyan-700 dark:text-cyan-200">
                                Academic Information
                            </h3>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>
                                    <span className="font-medium">Registration Number:</span> {student.reg_no || 'N/A'}
                                </li>
                                <li>
                                    <span className="font-medium">ACCA Reg:</span> {student.acca_reg || 'N/A'}
                                </li>
                                <li>
                                    <span className="font-medium">Papers:</span>{" "}
                                    {Array.isArray(student.papers) && student.papers.length > 0
                                        ? student.papers.map((paper, idx) => {
                                            if (typeof paper === "object" && paper !== null) {
                                                return (
                                                    <span key={idx}>
                                                        {Object.values(paper).join(", ")}
                                                        {idx < student.papers.length - 1 ? ", " : ""}
                                                    </span>
                                                );
                                            }
                                            return (
                                                <span key={idx}>
                                                    {String(paper)}
                                                    {idx < student.papers.length - 1 ? ", " : ""}
                                                </span>
                                            );
                                        })
                                        : "N/A"}
                                </li>
                                {student.terms && (
                                    <li>
                                        <span className="font-medium">Terms:</span>{" "}
                                        {Object.entries(student.terms)
                                            .map(
                                                ([key, value]) =>
                                                    `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
                                            )
                                            .join(", ")}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold mb-2 text-cyan-700 dark:text-cyan-200">
                        Papers
                    </CardTitle>
                    <CardDescription>
                        List of papers the student is enrolled in.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {Array.isArray(student.papers) && student.papers.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {student.papers.map((paper, idx) => {
                                if (typeof paper === "object" && paper !== null) {
                                    // paper is like { "BT": "Business And Technology" }
                                    const entries = Object.entries(paper);
                                    return entries.map(([code, name], i) => (
                                        <li key={code + idx + i}>
                                            <span className="font-mono font-semibold">{code}</span>
                                            {": "}
                                            <span>{name}</span>
                                        </li>
                                    ));
                                }
                                // fallback for unexpected structure
                                return (
                                    <li key={idx}>
                                        <span>{String(paper)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-sm text-muted-foreground">No papers found.</div>
                    )}
                </CardContent>
            </Card>

            <PaymentHistoryPage student={student} />
        </div>
    )
}

export const EditStudent = () => {
    const { reg_no } = useParams()
    const navigate = useNavigate()
    const id = reg_no
    const [is1Expanded, setIs1Expanded] = useState(false)
    const [is2Expanded, setIs2Expanded] = useState(true)
    const [is3Expanded, setIs3Expanded] = useState(false)
    const [student, setStudent] = useState<UserState | undefined>(undefined)
    const [students, setStudents] = useState<UserState[]>([])
    const initialStudent = students.find(student => student.reg_no === id)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/list-students?criteria=all');
                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                // Transform API data to match Student type if needed
                const mapped = data.map((item: UserState) => ({
                    title: item.title,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    profile_pic: item.profile_pic,
                    email: item.email,
                    reg_no: item.reg_no,
                    gender: item.gender,
                    newStudent: item.user_status === 'student',
                    dateOfBirth: item.dob,
                    papers: item.papers,
                }));
                setStudents(mapped);
            } catch (error) {
                // Optionally, you could set an error state here
                console.error("Failed to fetch students:", error);
            }
        };
        (async () => {
            await fetchStudents();
        })();
    }, []);

    useEffect(() => {
        if (id) setStudent(students.find(student => student.reg_no === id))
        else if (reg_no) setStudent(students.find(student => student.reg_no === reg_no))
        else navigate('/manage-students/students')
    }, [id, navigate, reg_no, students])

    useEffect(() => {
        document.title = (student?.firstname || '') + " " + (student?.lastname || '') + " - Ivy League Associates";
    }, [student?.firstname, student?.lastname]);

    useEffect(() => {
        if (student) setStudent(student)
    }, [student])

    const handleSave = () => {
        console.log(student)
    }

    const handleCancel = () => {
        navigate('/manage-students/students')
    }

    const handleReset = () => {
        setStudent(initialStudent)
    }

    if(!student) return <Error404Page title='Student'/>

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Edit Student</h1>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                    <CardDescription>Update the student's personal and academic details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-8">
                        <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-1 bg-blue-600 rounded-full" />
                            <h3 className="text-lg font-semibold">Personal Details</h3>
                            {is1Expanded ? <ChevronUp className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIs1Expanded(false)} /> : <ChevronDown className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIs1Expanded(true)} />}
                        </div>
                            {is1Expanded && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue={(student?.firstname || '') + " " + (student?.lastname || '')} placeholder="Enter full name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={student?.email} placeholder="Enter email" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                        <Input id="dateOfBirth" type="date" defaultValue={student?.dob ? format(new Date(student.dob), 'yyyy-MM-dd') : undefined} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select defaultValue={student?.gender}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-1 bg-green-600 rounded-full" />
                                <h3 className="text-lg font-semibold">Academic Information</h3>
                                {is2Expanded ? <ChevronUp className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIs2Expanded(false)} /> : <ChevronDown className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIs2Expanded(true)} />}
                            </div>
                            {is2Expanded && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="registrationNumber">Registration Number</Label>
                                        <Input id="registrationNumber" defaultValue={student?.reg_no} placeholder="Enter registration number" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Papers</Label>
                                        <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            {(student?.papers as unknown as APIPaper[] | undefined)?.map((paper) => (
                                                <div className="flex items-center space-x-2" key={paper.name}>
                                                    <Checkbox id={paper.name} defaultChecked />
                                                    <Label htmlFor={paper.name}>{paper.name}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-1 bg-purple-600 rounded-full" />
                                <h3 className="text-lg font-semibold">Payment Details</h3>
                                {is3Expanded ? <ChevronUp className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIs3Expanded(false)} /> : <ChevronDown className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIs3Expanded(true)} />}
                            </div>
                            {is3Expanded && (
                                <div className="grid grid-cols-2 gap-4">
                                    
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={handleReset}>Reset</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export const SearchStudent = () => {
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<UserState[]>([])
    const [students, setStudents] = useState<UserState[]>([])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/list-students?criteria=all');
                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                // Transform API data to match Student type if needed
                const mapped = data.map((item: UserState) => ({
                    title: item.title,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    email: item.email,
                    reg_no: item.reg_no,
                    gender: item.gender,
                    newStudent: item.user_status === 'student',
                    dateOfBirth: item.dob,
                    papers: item.papers,
                }));
                setStudents(mapped);
            } catch (error) {
                // Optionally, you could set an error state here
                console.error("Failed to fetch students:", error);
            }
        };
        (async () => {
            await fetchStudents();
        })();
    }, []);

    useEffect(() => {
        document.title = "Search Students - Ivy League Associates"
    }, [])

    const handleSearch = (value: string) => {
        setSearch(value)
        const filtered = students.filter(student => 
            (student.firstname || '').toLowerCase().includes(value.toLowerCase()) || 
            (student.lastname || '').toLowerCase().includes(value.toLowerCase()) || 
            (student.reg_no || '').toLowerCase().includes(value.toLowerCase()) ||
            (student.email || '').toLowerCase().includes(value.toLowerCase())
        )
        setResults(filtered)
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Search Students</h1>
                    <p className="text-muted-foreground">
                        Find students by name, registration number, or email
                    </p>
                </div>
            </div>
            
            <div className="space-y-4">
                <Input 
                    placeholder="Search by name, registration number, or email..." 
                    className="w-full max-w-md"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                
                {search ? (
                    <div className="space-y-4">
                        <div className="text-muted-foreground text-sm">
                            Found {results.length} student{results.length !== 1 ? 's' : ''}
                        </div>
                        <DataTable 
                            columns={columns} 
                            data={results} 
                            searchKey="firstname"
                            searchPlaceholder="Search within results..."
                            onBulkDelete={(selectedStudents) => {
                                console.log('Bulk delete students:', selectedStudents);
                                // Implement bulk delete logic here
                            }}
                            onBulkExport={(selectedStudents) => {
                                console.log('Bulk export students:', selectedStudents);
                                // Implement bulk export logic here
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                        <Users className="size-16 opacity-50" />
                        <p className="text-sm">Enter a name, registration number, or email to search for students</p>
                    </div>
                )}
            </div>
        </div>
    )
}