import { Card, CardContent, } from '@/components/ui/card';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { students } from '@/lib/data';
import { BookOpen, ChevronLeft, ChevronRight, CreditCard, GraduationCap, Home, Library, Search, Settings, User, Users, Menu } from 'lucide-react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Student } from '@/lib/types';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import Error404Page from '@/components/404';
import { cn } from '@/lib/utils';
import CourseRegistration from './CoureRegistration';

const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface AvProps {
    active?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const CoursePageItems = [
  {
    title: "Register",
    description: "Register for a course",
    path: "/student-dashboard/courses/register"
  },
  {
    title: "View Courses", 
    description: "View your registered courses",
    path: "/student-dashboard/courses/view"
  },
  {
    title: "Print Courses",
    description: "Print course materials",
    path: "/student-dashboard/courses/print"
  }
]

const HomePageItems = [
  {
    title: "Courses", 
    description: "Visit the courses page",
    path: "/student-dashboard/courses"
  },
  {
    title: "Payments",
    description: "Visit the payments page",
    path: "/student-dashboard/payments"
  },
  {
    title: "Resources",
    description: "Visit the resources page",
    path: "/student-dashboard/resources"
  }
]

const Av = forwardRef<HTMLSpanElement, AvProps>(({ active, className, children }, ref) => (
    <span 
    ref={ref} 
    className={cn(`${active && "border-cyan-500"} relative flex h-10 w-10 shrink-0 overflow-hidden group hover:border-cyan-500 border p-1 rounded-full`, className)}
    >
      <span className={`${active && "!bg-cyan-500 !text-white"} flex h-full w-full items-center justify-center group-hover:bg-cyan-500 group-hover:!text-white rounded-full bg-muted p-1`}>{children}</span>
    </span>
))

export default function Dashboard() {
    const location = useLocation()
    const navigate = useNavigate()
    const type = location.pathname.split('/').pop()
    const [isFull, setIsFull] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    useEffect(() => {
        document.title = "Students - Ivy League Associates";
    }, []);

    const toggleSidebar = useCallback((value: boolean) => {
        localStorage.setItem('sidebar', JSON.stringify(value))
        setIsFull(value)
    }, [])

    const toggleMobileSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

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
        title: "Home",
        icon: <Home className={`size-4 ${isFull && 'mr-1'}`} />
      },
      {
        title: "Courses", 
        icon: <BookOpen className={`size-4 ${isFull && 'mr-1'}`} />
      },
      {
        title: "Payments", 
        icon: <CreditCard className={`size-4 ${isFull && 'mr-1'}`} />
      },
      // {
      //   title: "Assignments",
      //   icon: <EditIcon className={`size-4 ${isFull && 'mr-1'}`} />
      // },
      {
        title: "Profile",
        icon: <User className={`size-4 ${isFull && 'mr-1'}`} />
      },
      {
        title: "Resources",
        icon: <Library className={`size-4 ${isFull && 'mr-1'}`} />
      }
    ]
    
    return (
        <div className='flex'>

            {/* Sidebar */}
            <div
                className={`flex flex-col gap-2 m-2 h-[calc(100vh-16px)] overflow-y-auto fixed sm:relative sm:flex sm:translate-x-0 transition-transform duration-200 ease-in-out z-40 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-[200%]'
                }`}
            >

                <div className={`flex flex-col items-center space-y-1.5 ${isFull ? 'p-4' : 'p-3'} rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground shadow`}>
                    {isFull ? 
                      <div className={`font-semibold leading-none tracking-tight ${!isFull && 'overflow-hidden'}`}>
                        Ivy League Associates
                      </div> : 
                      <GraduationCap className='size-6'/>
                    }
                </div>

                <div className={`flex flex-col flex-1 items-center gap-2 ${isFull ? 'p-2 rounded-3xl' : 'px-1 py-2 rounded-[2rem]'} text-sm border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground relative shadow`}>
                    <div 
                    className={`flex items-center ${type === 'search' && (isFull ? 'bg-gray-200 dark:bg-gray-800' : '!border-cyan-500')} ${isFull ? 'hover:bg-gray-200 dark:hover:bg-gray-800 justify-start w-full' : 'justify-center group hover:border-cyan-500'} p-2 rounded-full border border-slate-300 overflow-hidden cursor-pointer relative`}
                    onClick={() => navigate('/student-dashboard/search')}
                    >
                        <Search className={`size-4 text-muted-foreground group-hover:text-cyan-500 ${type === 'search' && !isFull && '!text-cyan-500'} ${isFull && 'mr-1'}`} />
                        {isFull && 'Search'}
                    </div>

                    
                    {sideItems && sideItems.map(item => (
                        <div 
                        key={item.title} 
                        className={`flex ${type === item.title.toLowerCase() && isFull && 'bg-gray-200 dark:bg-gray-800'} ${isFull ? 'justify-start hover:bg-gray-200 dark:hover:bg-gray-800 p-2' : 'justify-center'} p-1 overflow-hidden rounded-full cursor-pointer relative w-full transition-colors`}
                        onClick={() => navigate('/student-dashboard/' + item.title.toLowerCase())}
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                      {isFull ? item.icon : <Av active={type === item.title.toLowerCase()}>{item.icon}</Av>}
                                    </TooltipTrigger>
                                    <TooltipContent side='right' sideOffset={8}>
                                        Visit {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {isFull && <span className="ml-2">{item.title}</span>}
                        </div>
                    ))}

                    <div 
                    className={`p-2 rounded-full cursor-pointer flex items-center 
                      ${type === 'settings' && (isFull ? 'bg-gray-200 dark:bg-gray-800' : '!border-cyan-500')} 
                      ${isFull ? 'hover:bg-gray-200 dark:hover:bg-gray-800 w-full justify-start' : 'justify-center group hover:!border-cyan-500 border border-slate-200 dark:border-slate-700'} 
                      ${type === "settings" && "border-cyan-500"} 
                      space-x-3`
                    }
                    onClick={() => navigate('/student-dashboard/settings')}
                    >
                        <Settings className={`w-5 h-5 group-hover:text-cyan-500 ${type === 'settings' && !isFull && '!text-cyan-500'} ${type === "settings" && "text-cyan-500"}`} />
                        {isFull && <span className='dark:text-white'>Settings</span>}
                    </div>

                    <div className='absolute bottom-3 p-2 rounded-full cursor-pointer flex items-center border hover:bg-gray-200 dark:hover:bg-gray-800' onClick={() => toggleSidebar(!isFull)}>
                        {isFull && "Collapse"}
                        {isFull ? <ChevronLeft className="cursor-pointer size-4 ml-1"  /> : <ChevronRight className="cursor-pointer size-4 ml-1" />}
                    </div>
                </div>
                
                <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground shadow">
                  <div className="font-semibold leading-none tracking-tight text-xs text-gray-400">© {isFull && 'Copyright ' + new Date().getFullYear()}</div>
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-lg z-30"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Main Content */}
            <div className="flex flex-1 flex-col items-start gap-2 m-2 h-[calc(100vh-16px)] overflow-y-auto">
              <div className="flex flex-row items-center gap-2 max-w-[calc(100vw-16px)]">
                {/* Mobile Sidebar Toggle Button */}
                <div
                  onClick={toggleMobileSidebar}
                  className="sm:hidden p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                >
                  <Menu className="size-6" />
                </div>
                <div className="flex flex-col items-center space-y-1.5 p-3 max-w-[calc(100vw-68px)] rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground shadow">
                  <BreadcrumbNav/>
                </div>
              </div>
              
              <Card className="p-2 flex-1 overflow-y-auto w-full">
                <CardContent className='px-2 py-2 space-y-4'>

                  <div className="block space-y-4 p-6 max-[639px]:text-center bg-cyan-500 border border-gray-200 rounded-lg shadow hover:bg-cyan-400 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="space-y-2">
                        <h5 className="text-xl font-bold tracking-tight text-white">{students[0].name}</h5>
                        <p className="font-normal text-white">Registration Number: <b>{students[0].registrationNumber}</b></p>
                        <p className="font-normal text-white">Email: <b>{students[0].email}</b></p>
                      </div>
                      <div className="space-y-2 text-right">
                        <p className="font-normal text-white">Papers Registered: <b>{students[0].papers.length}</b></p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {students[0].type.map((type, index) => (
                        <span key={index} className="px-3 py-1 text-sm bg-white/20 rounded-full text-white">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Tabs defaultValue={'home'} value={type} onValueChange={(value) => navigate(`/student-dashboard/${value}`)}>
                      <Routes>
                          <Route path="home" element={
                            <TabsContent value="home">
                              <CoursesPage menuItems={HomePageItems}/>
                            </TabsContent>
                          } />
                          <Route path="courses/*" element={
                            <Routes>
                              <Route path="/" element={<CoursesPage menuItems={CoursePageItems}/>} />
                              <Route path="register" element={
                                <TabsContent value="register">
                                  <CourseRegistration/>
                                </TabsContent>
                              } />
                              <Route path="view" element={
                                <TabsContent value="view">
                                  <CoursesPage menuItems={CoursePageItems}/>
                                </TabsContent>
                              } />
                              <Route path="print" element={
                                <TabsContent value="print">
                                  <CoursesPage menuItems={CoursePageItems}/>
                                </TabsContent>
                              } />
                            </Routes>
                          } />
                          <Route path="search" element={
                            <TabsContent value="search">
                              <SearchPage/>
                            </TabsContent>
                          } />
                          <Route path="*" element={
                            <Error404Page/>
                          } />
                      </Routes>
                  </Tabs>
                  
                  {/* <section>
                    <details className="bg-white dark:bg-gray-800 border border-red-500 p-6 rounded-lg">
                      <summary className="cursor-pointer text-lg font-medium">
                        Announcements
                      </summary>
                      <div className="mt-4 space-y-2">
                        <p>User Retention Rate: 85%</p>
                        <p>Churn Rate: 5%</p>
                        <p>Average Revenue Per User: $145</p>
                      </div>
                    </details>
                  </section> */}
                </CardContent>
              </Card>
            </div>
        </div>
    )
}

const CoursesPage = ({ menuItems }:{ menuItems: typeof CoursePageItems }) => {

  return (
    <div className="w-full">
        <div className="grid sm:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className="block p-6 max-[639px]:text-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
              <p className="font-normal ">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
  )
}

const SearchPage = () => {
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
                    {/* {results.map(student => (
                        <StudentCard key={student.registrationNumber} theStudent={student} />
                    ))} */}
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