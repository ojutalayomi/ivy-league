import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { students } from '@/lib/data';
import { BookText, ChevronDown, ChevronUp, EditIcon, UserIcon } from 'lucide-react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Student } from '@/lib/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function ManageUsers() {
    const location = useLocation()
    const navigate = useNavigate()
    const type = location.pathname.split('/').pop()
    
    return (
        <div className='flex'>
            <Card className="m-2 p-2 flex-1 h-[calc(100vh-16px)] overflow-y-auto">
                <CardHeader>
                    <CardTitle>Ivy League Associates | Manage Students</CardTitle>
                </CardHeader>
                <CardContent className='px-2'>
                    <Tabs defaultValue={type || 'intensive'} value={type || 'intensive'} onValueChange={(value) => navigate(`/manage-users/${value}`)}>
                        <TabsList className="justify-around">
                            <TabsTrigger className="px-2 text-xs" value="intensive" onClick={() => navigate('/manage-users/intensive')}>
                                <UserIcon className="size-4 text-muted-foreground mr-1" />
                                Intensive
                            </TabsTrigger>
                            <TabsTrigger className="px-2 text-xs" value="standard" onClick={() => navigate('/manage-users/standard')}>
                                <BookText className="size-4 text-muted-foreground mr-1" />
                                Standard
                            </TabsTrigger>
                        </TabsList>
                        <Routes>
                            <Route path="/" element={<div>Manage Users</div>} />
                            <Route path="/:type" element={
                                <TabsContent value={type || 'intensive'}>
                                    <StudentList />
                                </TabsContent>} />
                        </Routes>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

const StudentList = () => {
    const [search, setSearch] = useState('')
    const location = useLocation()
    const type = location.pathname.split('/').pop()

    const filteredStudents = () => {
        return students.filter(student => student.type === type).filter(student => student.name.toLowerCase().includes(search.toLowerCase()) || student.registrationNumber.toLowerCase().includes(search.toLowerCase()))
    }

    return (
        <div className='space-y-2'>
            <Input placeholder="Search by name or registration number" className="w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="bg-white dark:bg-black text-2xl font-bold sticky top-0 z-10">
                {type === 'intensive' ? 'Intensive' : 'Standard'} Students ({filteredStudents().length})
            </div>
            <div className="flex flex-col gap-2">
            {filteredStudents().map(student => (
                <StudentCard key={student.registrationNumber} student={student} />
            ))}
            </div>
        </div>
    );
};

const StudentCard = ({student}: {student: Student}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    return (
        <Card className='bg-gradient-to-br from-cyan-100 to-white-200'>
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
                            <Button variant="outline" size="icon">
                                <EditIcon className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="space-y-4 transition-all duration-300">
                            <div>
                                <p className="text-sm font-medium">Student Details</p>
                                <div className="text-sm text-muted-foreground">
                                    <div className="flex flex-col gap-1">
                                        <span>Level: {student.preferences.level.toLocaleUpperCase()}</span>
                                        {/* <span>Type: {student.type.toLocaleUpperCase()}</span> */}
                                        <span>Gender: {student.gender.toLocaleUpperCase()}</span>
                                        <span>Date of Birth: {student.dateOfBirth}</span>
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
                                Total Fee: ${student.totalFee}
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