import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { students } from '@/lib/data';
import { BookText, ChevronDown, ChevronUp, EditIcon, EyeIcon, UserIcon } from 'lucide-react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
    const [edit, setEdit] = useState('')
    const type = location.pathname.split('/').pop()

    useEffect(() => {
        document.title = "Manage Students - Ivy League Associates";
    }, []);

    useEffect(() => {
        if (location.pathname.includes('edit')) setEdit(location.pathname.split('/').pop() || '')
    }, [location.pathname])
    
    return (
        <div className='flex'>
            <Card className="m-2 p-2 flex-1 h-[calc(100vh-16px)] overflow-y-auto">
                <CardHeader>
                    <CardTitle>Ivy League Associates | Manage Students</CardTitle>
                </CardHeader>
                <CardContent className='px-2'>
                    <Tabs defaultValue={'menu'} value={type} onValueChange={(value) => navigate(`/manage-students/${value}`)}>
                        <TabsList className="justify-around">
                            <TabsTrigger className="px-2 text-xs" value="all" onClick={() => navigate('/manage-students/all')}>
                                <UserIcon className="size-4 text-muted-foreground mr-1" />
                                All
                            </TabsTrigger>
                            <TabsTrigger className="px-2 text-xs" value="intensive" onClick={() => navigate('/manage-students/intensive')}>
                                <UserIcon className="size-4 text-muted-foreground mr-1" />
                                Intensive
                            </TabsTrigger>
                            <TabsTrigger className="px-2 text-xs" value="standard" onClick={() => navigate('/manage-students/standard')}>
                                <BookText className="size-4 text-muted-foreground mr-1" />
                                Standard
                            </TabsTrigger>
                            <TabsTrigger className="px-2 text-xs" value="view" onClick={() => navigate('/manage-students/view')}>
                                <EyeIcon className="size-4 text-muted-foreground mr-1" />
                                View
                            </TabsTrigger>
                            <TabsTrigger className="px-2 text-xs" value={edit} onClick={() => navigate(`/manage-students/edit/${edit}`)}>
                                <EditIcon className="size-4 text-muted-foreground mr-1" />
                                Edit
                            </TabsTrigger>
                        </TabsList>
                        <Routes>
                            <Route path="all" element={
                                <TabsContent value="all">
                                    <StudentList setEdit={setEdit}/>
                                </TabsContent>
                            } />
                            <Route path="intensive" element={
                                <TabsContent value="intensive">
                                    <StudentList setEdit={setEdit}/>
                                </TabsContent>
                            } />
                            <Route path="standard" element={
                                <TabsContent value="standard">
                                    <StudentList setEdit={setEdit}/>
                                </TabsContent>
                            } />
                            <Route path="view" element={
                                <TabsContent value="view">
                                    <StudentList setEdit={setEdit}/>
                                </TabsContent>
                            } />
                            <Route path="add" element={
                                <TabsContent value="add">
                                    <StudentList setEdit={setEdit}/>
                                </TabsContent>
                            } />
                            <Route path="edit/*" element={
                                <Routes>
                                    <Route path=":registrationNumber" element={
                                        <TabsContent value={edit}>
                                            <EditStudent/>
                                        </TabsContent>
                                    } />
                                </Routes>
                            } />
                            <Route path="delete" element={
                                <TabsContent value="delete">
                                    <StudentList setEdit={setEdit}/>
                                </TabsContent>
                            } />
                        </Routes>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

const StudentList = ({setEdit}: {setEdit: React.Dispatch<React.SetStateAction<string>>}) => {
    const [search, setSearch] = useState('')
    const location = useLocation()
    const type = location.pathname.split('/').pop()
    useEffect(() => {
      document.title = (type ? type[0].toUpperCase() + type.slice(1) : "All") + " Students - Ivy League Associates";
    }, [type]);

    const filteredStudents = () => {
        if (type !== 'all') return students.filter(student => student.type === type).filter(student => student.name.toLowerCase().includes(search.toLowerCase()) || student.registrationNumber.toLowerCase().includes(search.toLowerCase()))
        else return students    
    }

    return (
        <div className='space-y-2'>
            <Input placeholder="Search by name or registration number" className="w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="bg-white dark:bg-gray-900 text-2xl font-bold sticky top-0 z-10">
                {type === 'intensive' ? 'Intensive' : 'Standard'} Students ({filteredStudents().length})
            </div>
            <div className="flex flex-col gap-2">
            {filteredStudents().map(student => (
                <StudentCard key={student.registrationNumber} student={student} setEdit={setEdit}/>
            ))}
            </div>
        </div>
    );
};

const StudentCard = ({student, setEdit}: {student: Student, setEdit: React.Dispatch<React.SetStateAction<string>>}) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (isExpanded) cardRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'})
    }, [isExpanded])

    return (
        <Card ref={cardRef} className='dark:bg-gray-900 dark:border dark:border-gray-700'>
            <CardHeader className='hidden'>
                <CardTitle>{student.name}</CardTitle>
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
                        <div className="flex items-center gap-2">
                            <Link to={`/manage-students/edit/${student.registrationNumber}`} onClick={() => setEdit(student.registrationNumber)}>
                                <Button variant="outline" size="icon">
                                    <EditIcon className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="space-y-4 transition-all duration-300">
                            <div>
                                <p className="text-sm font-medium">Student Details</p>
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
                                <p className="text-sm text-muted-foreground">
                                Payment Method: {student.paymentDetails.paymentMethod}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Payment Status: {student.paymentDetails.paymentStatus}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const EditStudent = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const id = location.pathname.split('/').pop()
    const filteredStudent = students.find(student => student.registrationNumber === id)
    const [student, setStudent] = useState<Student | undefined>(undefined)

    useEffect(() => {
        document.title = student?.name + " - Ivy League Associates";
    }, [student?.name]);

    useEffect(() => {
        if (filteredStudent) setStudent(filteredStudent)
    }, [filteredStudent])

    const handleSave = () => {
        console.log(student)
    }

    const handleCancel = () => {
        navigate('/manage-students/all')
    }

    const handleReset = () => {
        setStudent(filteredStudent)
    }

    return (
        <div className="space-y-6">
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
                                    <Input id="dateOfBirth" type="date" defaultValue={student?.dateOfBirth} />
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