import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { students } from '@/lib/data';
import { BookText, ChevronDown, ChevronUp, EditIcon, EyeIcon, SearchIcon, UserIcon, Users } from 'lucide-react';
import { Link, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Student } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

export default function ManageStudents() {
    const location = useLocation()
    const navigate = useNavigate()
    const type = location.pathname.split('/').pop()
    
    useEffect(() => {
        document.title = "Manage Students - Ivy League Associates";
    }, []);
    
    return (
        <div className='flex'>
            <Card className="m-2 p-2 flex-1 h-[calc(100vh-16px)] overflow-y-auto">
                <CardHeader>
                    <CardTitle>Ivy League Associates | Manage Students</CardTitle>
                </CardHeader>
                <CardContent className='px-2'>
                    <Tabs defaultValue={'all'} value={type} onValueChange={(value) => navigate(`/manage-students/${value}`)}>
                        <div>
                            <TabsList className="grid grid-cols-6 max-[570px]:grid-cols-3 h-auto gap-2">
                                <TabsTrigger className="flex items-center justify-center px-2 text-xs" value="all" onClick={() => navigate('/manage-students/all')}>
                                    <UserIcon className="size-4 text-muted-foreground mr-1" />
                                    All
                                </TabsTrigger>
                                <TabsTrigger className="flex items-center justify-center px-2 text-xs" value="intensive" onClick={() => navigate('/manage-students/intensive')}>
                                    <UserIcon className="size-4 text-muted-foreground mr-1" />
                                    Intensive
                                </TabsTrigger>
                                <TabsTrigger className="flex items-center justify-center px-2 text-xs" value="standard" onClick={() => navigate('/manage-students/standard')}>
                                    <BookText className="size-4 text-muted-foreground mr-1" />
                                    Standard
                                </TabsTrigger>
                                <TabsTrigger className="flex items-center justify-center px-2 text-xs" value="view">
                                    <EyeIcon className="size-4 text-muted-foreground mr-1" />
                                    View
                                </TabsTrigger>
                                <TabsTrigger className="flex items-center justify-center px-2 text-xs" value="edit">
                                    <EditIcon className="size-4 text-muted-foreground mr-1" />
                                    Edit
                                </TabsTrigger>
                                <TabsTrigger className="flex items-center justify-center px-2 text-xs" value="search">
                                    <SearchIcon className="size-4 text-muted-foreground mr-1" />
                                    Search
                                </TabsTrigger>
                            </TabsList>

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
                                        <StudentCard/>
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
                            </Routes>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
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
        if (type !== 'all') return students.filter(student => student.type === type)
        else return students    
    }

    return (
        <div className='space-y-2'>
            <div className="bg-white dark:bg-gray-900 text-2xl font-bold sticky top-0 z-10">
                {type === 'intensive' ? 'Intensive' : 'Standard'} Students ({filteredStudents().length})
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

    if (!student) return null
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
                                        <span>Type: {student.type.toLocaleUpperCase()}</span>
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

const EditStudent = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const id = searchParams.get('regNo')
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
                            <h3 className="text-lg font-medium">Personal Details</h3>
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
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Academic Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="registrationNumber">Registration Number</Label>
                                    <Input id="registrationNumber" defaultValue={student?.registrationNumber} placeholder="Enter registration number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Student Type</Label>
                                    <Select defaultValue={student?.type}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="intensive">Intensive</SelectItem>
                                            <SelectItem value="standard">Standard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="newStudent">New Student</Label>
                                    <Checkbox id="newStudent" checked={student?.newStudent} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="revision">Revision</Label>
                                    <Checkbox id="revision" checked={student?.revision} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Papers</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {student?.papers.map(paper => (
                                            <div className="flex items-center space-x-2" key={paper}>
                                                <Checkbox id={paper} defaultChecked />
                                                <Label htmlFor={paper}>{paper}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Payment Details</h3>
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