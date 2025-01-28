import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { students } from '@/lib/data';
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, EditIcon, Search, Settings, Users } from 'lucide-react';
import { Link, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Student, UserType } from '@/lib/types';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import Logo from "@/assets/ivyLight.png";
import LogoDark from "@/assets/ivyDark.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import Error404Page from '@/components/404';
import { cn } from '@/lib/utils';

const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface AvProps {
    active?: boolean;
    className?: string;
    label: string;
}

const Av = forwardRef<HTMLSpanElement, AvProps>(({ active, className, label }, ref) => (
    <span 
    ref={ref} 
    className={cn(`${active && "border-cyan-500"} relative flex h-10 w-10 shrink-0 overflow-hidden group hover:border-cyan-500 border p-1 rounded-full`, className)}
    >
        <span className={`${active && "!bg-cyan-500 text-white"} flex h-full w-full items-center justify-center group-hover:bg-cyan-500 group-hover:text-white rounded-full bg-muted p-1`}>{label}</span>
    </span>
))

export default function ManageStudents() {
    const location = useLocation()
    const navigate = useNavigate()
    const type = location.pathname.split('/').pop()
    const [isFull, setIsFull] = useState(false)
    
    useEffect(() => {
        document.title = "Manage Students - Ivy League Associates";
    }, []);

    const toggleSidebar = useCallback((value: boolean) => {
        localStorage.setItem('sidebar', JSON.stringify(value))
        setIsFull(value)
    }, [])

    useEffect(() => {
        const sidebar = localStorage.getItem('sidebar')
        if (sidebar) toggleSidebar(JSON.parse(sidebar))
    })

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (
            event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
            (event.metaKey || event.ctrlKey)
          ) {
            event.preventDefault()
            toggleSidebar(!isFull)
          }
        }
  
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isFull, toggleSidebar])

    const sideItems = [
        {
            title: "All",
            icon: <Users className={`size-4 text-muted-foreground ${isFull && 'mr-1'}`} />
        },
        {
            title: "Intensive",
            icon: <BookOpen className={`size-4 text-muted-foreground ${isFull && 'mr-1'}`} />
        },
        {
            title: "Standard",
            icon: <BookOpen className={`size-4 text-muted-foreground ${isFull && 'mr-1'}`} />
        }
    ]
    
    return (
        <div className='flex'>
            {/* Sidebar */}
            <div className="flex flex-col gap-2 m-2 h-[calc(100vh-16px)] overflow-y-auto">

                <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground shadow">
                    <div className={`font-semibold leading-none tracking-tight ${!isFull && 'aspect-square w-7 h-7 overflow-hidden'}`}>
                        {isFull ? 'Ivy League Associates' : (
                            <>
                            <img src={Logo} alt="Ivy League" className="dark:hidden mx-auto" />
                            <img src={LogoDark} alt="Ivy League" className="hidden dark:block mx-auto" />
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center space-y-1.5 p-2 rounded-3xl text-sm border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground relative shadow">
                    <div 
                    className={`flex items-center ${type === 'search' && (isFull ? 'bg-gray-50 dark:bg-gray-800' : '!border-cyan-500')} ${isFull ? 'hover:bg-slate-300 dark:hover:bg-gray-800 justify-start w-full' : 'justify-center group hover:border-cyan-500'} p-2 rounded-full border border-slate-300 overflow-hidden cursor-pointer relative`}
                    onClick={() => navigate('/manage-students/search')}
                    >
                        {/* {type === "search" && <div className="h-full w-1 absolute left-0 bg-cyan-500 rounded-full"/>} */}
                        <Search className={`size-4 text-muted-foreground group-hover:text-cyan-500 ${type === 'search' && !isFull && '!text-cyan-500'} ${isFull && 'mr-1'}`} />
                        {isFull && 'Search'}
                    </div>

                    <p className={`!mt-4 text-start ${!isFull && 'hidden'}`}>STUDENTS</p>
                    {sideItems && sideItems.map(item => (
                        <div 
                        key={item.title} 
                        className={`flex items-center ${type === item.title.toLowerCase() && isFull && 'bg-gray-50 dark:bg-gray-800'} ${isFull ? 'justify-start hover:bg-gray-50 dark:hover:bg-gray-800 p-2' : 'justify-center'} p-1 overflow-hidden rounded-full cursor-pointer relative w-full transition-colors`}
                        onClick={() => navigate('/manage-students/' + item.title.toLowerCase())}
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        {isFull ? item.icon : <Av active={type === item.title.toLowerCase()} label={item.title[0]} />}
                                    </TooltipTrigger>
                                    <TooltipContent side='right' sideOffset={8}>
                                        Visit {item.title} students
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {isFull && <span className="ml-2">{item.title}</span>}
                        </div>
                    ))}

                    <p className={`!mt-4 text-start ${!isFull && 'hidden'}`}>MANAGE</p>
                    <div 
                    className={`p-2 rounded-full cursor-pointer flex items-center ${type === 'settings' && (isFull ? 'bg-gray-50 dark:bg-gray-800' : '!border-cyan-500')} ${isFull ? 'hover:bg-gray-50 dark:hover:bg-gray-800 w-full justify-start' : 'justify-center group hover:border-cyan-500 border border-slate-200 dark:border-slate-700'} ${type === "settings" && "border-cyan-500"} space-x-3 text-gray-600`}
                    onClick={() => navigate('/manage-students/settings')}
                    >
                        <Settings className={`w-5 h-5 group-hover:text-cyan-500 text-muted-foreground ${type === 'settings' && !isFull && '!text-cyan-500'} ${type === "settings" && "text-cyan-500"}`} />
                        {isFull && <span className='dark:text-white'>Settings</span>}
                    </div>

                    <div className='absolute bottom-3 p-2 rounded-full cursor-pointer flex items-center border hover:bg-gray-50 dark:hover:bg-gray-800' onClick={() => toggleSidebar(!isFull)}>
                        {isFull && "Collapse"}
                        {isFull ? <ChevronLeft className="cursor-pointer size-4 text-muted-foreground ml-1"  /> : <ChevronRight className="cursor-pointer size-4 text-muted-foreground ml-1" />}
                    </div>
                </div>
                
                <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground shadow">
                    <div className="font-semibold leading-none tracking-tight text-xs text-gray-400">© {isFull && 'Copyright ' + new Date().getFullYear()}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col items-start gap-2 m-2 h-[calc(100vh-16px)] overflow-y-auto">
                <div className="flex flex-col items-center space-y-1.5 p-3 rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground shadow">
                    <BreadcrumbNav/>
                </div>
                <Card className="p-2 flex-1 overflow-y-auto w-full">
                    <CardContent className='h-full px-2'>
                        <Tabs defaultValue={'all'} value={type} onValueChange={(value) => navigate(`/manage-students/${value}`)}>
                            <Routes>
                                <Route path="all" element={
                                    <TabsContent value="all">
                                        <StudentList/>
                                    </TabsContent>
                                } />
                                <Route path="intensive" element={
                                    <TabsContent value="intensive">
                                        <StudentList/>
                                    </TabsContent>
                                } />
                                <Route path="standard" element={
                                    <TabsContent value="standard">
                                        <StudentList/>
                                    </TabsContent>
                                } />
                                <Route path="view" element={
                                    <TabsContent value="view">
                                        <StudentView/>
                                    </TabsContent>
                                } />
                                <Route path="add" element={
                                    <TabsContent value="add">
                                        <StudentList/>
                                    </TabsContent>
                                } />
                                <Route path="edit" element={
                                    <TabsContent value="edit">
                                        <EditStudent/>
                                    </TabsContent>
                                } />
                                <Route path="delete" element={
                                    <TabsContent value="delete">
                                        <StudentList/>
                                    </TabsContent>
                                } />
                                <Route path="search" element={
                                    <TabsContent value="search">
                                        <SearchStudent/>
                                    </TabsContent>
                                } />
                                <Route path="*" element={
                                    <Error404Page/>
                                } />
                            </Routes>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const StudentList = () => {
    const location = useLocation()
    const type = location.pathname.split('/').pop()
    useEffect(() => {
      document.title = (type ? type[0].toUpperCase() + type.slice(1) : "All") + " Students - Ivy League Associates";
    }, [type]);

    const filteredStudents = () => {
        if (type !== 'all') return students.filter(student => student.type.includes(type as UserType))
        else return students    
    }

    return (
        <div className='space-y-2'>
            <div className="bg-white dark:bg-gray-900 text-2xl font-bold sticky top-0 z-10">
                {type === 'intensive' ? 'Intensive' : type === "Standard" ? 'Standard' : 'All'} Students ({filteredStudents().length})
            </div>
            <div className="flex flex-col gap-2">
            {filteredStudents().map(student => (
                <StudentCard key={student.registrationNumber} theStudent={student}/>
            ))}
            </div>
        </div>
    );
};

const StudentCard = ({theStudent}: {theStudent?: Student}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const cardRef = useRef<HTMLDivElement>(null)
    const [searchParams] = useSearchParams()
    const [isExpanded, setIsExpanded] = useState(false)
    const [student, setStudent] = useState<Student | undefined>(undefined)

    useEffect(() => {
        if (location.pathname.includes('view')) setTimeout(() => setIsExpanded(true), 500)
    }, [location.pathname])

    useEffect(() => {
        if (theStudent) setStudent(theStudent)
        else if (searchParams.get('regNo')) setStudent(students.find(student => student.registrationNumber === searchParams.get('regNo')))
        else navigate('/manage-students/all')
    }, [searchParams, theStudent, navigate])


    useEffect(() => {
        if (student) document.title = student.name + " - Ivy League Associates";
    }, [student, student?.name]);

    useEffect(() => {
        if (isExpanded) cardRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'})
    }, [isExpanded])

    if (!student) return <Error404Page title='Student'/>
    return (
        <Card ref={cardRef} className='dark:bg-gray-900 dark:border dark:border-gray-700' onClick={() => setIsExpanded(!isExpanded)}>
            <CardHeader className='hidden'>
                <CardTitle>{student?.name}</CardTitle>
            </CardHeader>
            <CardContent className='mt-4'>
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <Avatar className="border p-1 rounded-full">
                            <AvatarFallback className="p-1">
                            {student.name.split(' ')[0][0]}{student.name.split(' ')[1][0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="flex items-center font-medium text-cyan-500">
                            {student.name}
                            {isExpanded ? <ChevronUp className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIsExpanded(false)} /> : <ChevronDown className="cursor-pointer size-4 text-muted-foreground ml-1" onClick={() => setIsExpanded(true)} />}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            {student.registrationNumber} • {student.newStudent ? 'New Student' : 'Returning Student'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link to={`/manage-students/view?regNo=${student.registrationNumber}`}>
                                <Button variant="link" size="icon">
                                    <span>View</span>
                                    {/* <EyeIcon className="size-4" /> */}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="space-y-4 transition-all duration-300">
                            <div>
                                <div className="flex items-center justify-start">
                                    <p className="text-sm font-medium">Student Details</p>
                                    <Link to={`/manage-students/edit?regNo=${student.registrationNumber}`}>
                                        <Button variant="link" size="icon">
                                            <EditIcon className="size-4" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <div className="flex flex-col gap-1">
                                        <span>Level: {student.preferences.level.toLocaleUpperCase()}</span>
                                        <span>Type: {student.type.join(', ').toLocaleUpperCase()}</span>
                                        <span>Gender: {student.gender.toLocaleUpperCase()}</span>
                                        <span>Date of Birth: {format(new Date(student.dateOfBirth), 'dd MMMM yyyy')}</span>
                                        <span>Email: {student.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium">Academic Information</p>
                                <p className="text-sm text-muted-foreground">
                                Registration Number: {student.registrationNumber}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Papers: {student.papers.join(', ')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Revision: {student.revision ? 'Yes' : 'No'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">Payment Information</p>
                                <p className="text-sm text-muted-foreground">
                                Total Fee: #{student.totalFee}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Discount: #{student.discount}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Outstanding: #{student.outstanding}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Surplus: #{student.surplus}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Price: #{student.price}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Paid: #{student.paid}
                                </p>
                                {/* <p className="text-sm text-muted-foreground">
                                Payment Method: {student.paymentDetails.paymentMethod}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Payment Status: {student.paymentDetails.paymentStatus}
                                </p> */}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const StudentView = () => {
    const navigate = useNavigate()
    const cardRef = useRef<HTMLDivElement>(null)
    const [searchParams] = useSearchParams()
    const [student, setStudent] = useState<Student | undefined>(undefined)

    useEffect(() => {
        if (searchParams.get('regNo')) setStudent(students.find(student => student.registrationNumber === searchParams.get('regNo')))
        else navigate('/manage-students/all')
    }, [searchParams, navigate])


    useEffect(() => {
        if (student?.name) document.title = student.name + " - Ivy League Associates";
        else document.title = "Student - Ivy League Associates";
    }, [student, student?.name]);

    if (!student) return <Error404Page title='Student'/>

    return (
        <Card ref={cardRef} className='border-none'>
            <CardHeader className='hidden'>
                <CardTitle>{student?.name}</CardTitle>
            </CardHeader>
            <CardContent className='mt-4'>
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <Avatar className="border p-1 rounded-full">
                            <AvatarFallback className="p-1">
                            {student.name.split(' ')[0][0]}{student.name.split(' ')[1][0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="flex items-center font-medium text-cyan-500">
                            {student.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            {student.registrationNumber} • {student.newStudent ? 'New Student' : 'Returning Student'}
                            </p>
                        </div>
                        {/* <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link to={`/manage-students/view?regNo=${student.registrationNumber}`}>
                                <Button variant="link" size="icon">
                                    <span>View</span>
                                    //  <EyeIcon className="size-4" /> 
                                </Button>
                            </Link>
                        </div> */}
                    </div>

                    <div className="space-y-4 transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-start">
                                <p className="text-sm font-medium">Student Details</p>
                                <Link to={`/manage-students/edit?regNo=${student.registrationNumber}`}>
                                    <Button variant="link" size="icon">
                                        <EditIcon className="size-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <div className="flex flex-col gap-1">
                                    <span>Level: {student.preferences.level.toLocaleUpperCase()}</span>
                                    <span>Type: {student.type.join(', ').toLocaleUpperCase()}</span>
                                    <span>Gender: {student.gender.toLocaleUpperCase()}</span>
                                    <span>Date of Birth: {format(new Date(student.dateOfBirth), 'dd MMMM yyyy')}</span>
                                    <span>Email: {student.email}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium">Academic Information</p>
                            <p className="text-sm text-muted-foreground">
                            Registration Number: {student.registrationNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Papers: {student.papers.join(', ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Revision: {student.revision ? 'Yes' : 'No'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium">Payment Information</p>
                            <p className="text-sm text-muted-foreground">
                            Total Fee: #{student.totalFee}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Discount: #{student.discount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Outstanding: #{student.outstanding}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Surplus: #{student.surplus}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Price: #{student.price}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Paid: #{student.paid}
                            </p>
                            {/* <p className="text-sm text-muted-foreground">
                            Payment Method: {student.paymentDetails.paymentMethod}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Payment Status: {student.paymentDetails.paymentStatus}
                            </p> */}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const EditStudent = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const id = searchParams.get('regNo')
    const [is1Expanded, setIs1Expanded] = useState(false)
    const [is2Expanded, setIs2Expanded] = useState(true)
    const [is3Expanded, setIs3Expanded] = useState(false)
    const [student, setStudent] = useState<Student | undefined>(undefined)
    const initialStudent = students.find(student => student.registrationNumber === id)

    useEffect(() => {
        if (id) setStudent(students.find(student => student.registrationNumber === id))
        else navigate('/manage-students/all')
    }, [id, navigate])

    useEffect(() => {
        document.title = student?.name + " - Ivy League Associates";
    }, [student?.name]);

    useEffect(() => {
        if (student) setStudent(student)
    }, [student])

    const handleSave = () => {
        console.log(student)
    }

    const handleCancel = () => {
        navigate('/manage-students/all')
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
                                        <Input id="name" defaultValue={student?.name} placeholder="Enter full name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={student?.email} placeholder="Enter email" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                        <Input id="dateOfBirth" type="date" defaultValue={student?.dateOfBirth ? format(new Date(student.dateOfBirth), 'yyyy-MM-dd') : undefined} />
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
                                        <Input id="registrationNumber" defaultValue={student?.registrationNumber} placeholder="Enter registration number" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="type">Student Type</Label>
                                        <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            {student?.type.map(t => (
                                                <div className="flex items-center space-x-2" key={t}>
                                                    <Checkbox id={t} defaultChecked />
                                                    <Label htmlFor={t}>{t}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="revision">Revision</Label>
                                        <Checkbox id="revision" checked={student?.revision} />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Papers</Label>
                                        <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            {student?.papers.map(paper => (
                                                <div className="flex items-center space-x-2" key={paper}>
                                                    <Checkbox id={paper} defaultChecked />
                                                    <Label htmlFor={paper}>{paper}</Label>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="totalFee">Total Fee</Label>
                                        <Input id="totalFee" type="number" defaultValue={student?.totalFee} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount">Discount</Label>
                                        <Input id="discount" type="number" defaultValue={student?.discount} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="outstanding">Outstanding</Label>
                                        <Input id="outstanding" type="number" defaultValue={student?.outstanding} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="surplus">Surplus</Label>
                                        <Input id="surplus" type="number" defaultValue={student?.surplus} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" type="number" defaultValue={student?.price} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paid">Paid</Label>
                                        <Input id="paid" type="number" defaultValue={student?.paid} />
                                    </div>
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

const SearchStudent = () => {
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<Student[]>([])

    useEffect(() => {
        document.title = "Search Students - Ivy League Associates"
    }, [])

    const handleSearch = (value: string) => {
        setSearch(value)
        const filtered = students.filter(student => 
            student.name.toLowerCase().includes(value.toLowerCase()) || 
            student.registrationNumber.toLowerCase().includes(value.toLowerCase())
        )
        setResults(filtered)
    }

    return (
        <div className='space-y-4'>
            <Input 
                placeholder="Search by name or registration number" 
                className="w-full"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />
            
            {search && (
                <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">
                        Found {results.length} student{results.length !== 1 ? 's' : ''}
                    </div>
                    {results.map(student => (
                        <StudentCard key={student.registrationNumber} theStudent={student} />
                    ))}
                </div>
            )}
            {!search && (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                    <Users className="size-16 opacity-50" />
                    <p className="text-sm">Enter a name or registration number to search for students</p>
                </div>
            )}
        </div>
    )
}