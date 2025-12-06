import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Menu, Pen, Search, Settings, Text, Users, Wallet } from 'lucide-react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import Error404Page from '@/components/404';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';
import { DietPage, DietCreate, DietView, DietEdit } from './Diet';
import ManageStudentsMenu from './ManageStudentsMenu';
import { StudentList, StudentView, EditStudent, SearchStudent } from './Students';
import { PaymentsPage } from './Payments';
import { useUser } from '@/providers/user-provider';
import { PapersRoutesWithModals } from './Papers';
import { ScholarshipRoutesWithModals } from './Scholarship';

const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface AvProps {
    active?: boolean;
    className?: string;
    children: React.ReactNode;
}

const Av = forwardRef<HTMLSpanElement, AvProps>(({ active, className, children }, ref) => (
    <span 
    ref={ref} 
    className={cn(`${active && "border-cyan-500"} relative flex h-10 w-10 shrink-0 overflow-hidden group hover:border-cyan-500 border p-1 rounded-full`, className)}
    >
      <span className={`${active && "!bg-cyan-500 !text-white"} flex h-full w-full items-center justify-center group-hover:bg-cyan-500 group-hover:!text-white rounded-full bg-muted p-1`}>{children}</span>
    </span>
))

export default function ManageStudents() {
    const location = useLocation()
    const navigate = useNavigate()
    const type = location.pathname.split('/').pop()
    const { user } = useUser();
    const [isFull, setIsFull] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    useEffect(() => {
        document.title = "Manage Students - Ivy League Associates";
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
            title: "Dashboard",
            icon: <Text className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "View the dashboard"
        },
        {
            title: "Students",
            icon: <Users className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "View all students"
        },
        {
            title:"Papers",
            icon: <BookOpen className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "View all papers"
        },
        {
            title: "Diets",
            icon: <Pen className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "View diet details"
        },
        {
            title: "Scholarship",
            icon: <Pen className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "View scholarship details"
        },
        {
            title: "Diets",
            icon: <Pen className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "View diet details"
        },
        {
            title: "Payments",
            icon: <Wallet className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "View payment details"
        },
        {
            title: "Settings",
            icon: <Settings className={`size-4 ${isFull && 'mr-1'}`} />,
            description: "Go to settings"
        }
    ]

    if (user.user_status === '') return <Navigate to="/accounts/signin" replace />
    
    return (
        <div className='flex'>
            {/* Sidebar */}
            <div
                className={`flex flex-col gap-2 m-2 h-[calc(100vh-16px)] overflow-y-auto fixed sm:relative sm:flex sm:translate-x-0 transition-transform duration-200 ease-in-out z-40 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-[200%]'
                }`}
                onClick={toggleMobileSidebar}
            >

                <Link to="/menu">
                  <div className={`flex flex-col items-center space-y-1.5 ${isFull ? 'p-3' : 'p-3'} rounded-xl border bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900 shadow`}>
                      {isFull ? 
                        <div className={`bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text drop-shadow-2xl text-transparent animate-gradient-x truncate font-semibold ${!isFull && 'overflow-hidden'}`}>
                          Ivy League Associates
                        </div> : 
                        <GraduationCap className='size-6'/>
                      }
                  </div>
                </Link>

                <div className="flex flex-col flex-1 items-center space-y-1.5 p-2 rounded-3xl text-sm border bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900 relative shadow">
                    <div 
                    className={`flex items-center ${type === 'search' && (isFull ? 'bg-gray-50 dark:bg-gray-800' : '!border-cyan-500')} ${isFull ? 'hover:bg-slate-300 dark:hover:bg-gray-800 justify-start w-full' : 'justify-center group hover:border-cyan-500'} p-2 rounded-full border border-slate-300 overflow-hidden cursor-pointer relative`}
                    onClick={() => navigate('/search')}
                    >
                        {/* {type === "search" && <div className="h-full w-1 absolute left-0 bg-cyan-500 rounded-full"/>} */}
                        <Search className={`size-4 text-muted-foreground group-hover:text-cyan-500 ${type === 'search' && !isFull && '!text-cyan-500'} ${isFull && 'mr-1'}`} />
                        {isFull && 'Search'}
                    </div>

                    {sideItems && sideItems.reduce((acc: JSX.Element[], item, index) => {

                        if (item.title === 'Diet') {
                            acc.push(<p key={`manage-header-${item.title}`} className={`!my-2 text-start ${!isFull && 'hidden'}`}>MANAGE</p>)
                        }

                        acc.push (
                            <div 
                            key={`menu-item-${item.title}-${index}`} 
                            className={`flex items-center ${type === item.title.toLowerCase() && isFull && 'bg-gray-50 shadow dark:border dark:border-gray-500 dark:bg-gray-800'} ${isFull ? 'justify-start hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:border dark:hover:border-gray-500 p-2' : 'justify-center'} p-1 overflow-hidden rounded-full cursor-pointer relative w-full transition-colors`}
                            onClick={() => navigate('/' + item.title.toLowerCase())}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            {isFull ? item.icon : <Av active={type === item.title.toLowerCase()}>{item.icon}</Av>}
                                        </TooltipTrigger>
                                        <TooltipContent side='right' sideOffset={8}>
                                            {item.description}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {isFull && <span className="ml-2">{item.title}</span>}
                            </div>
                        )
                        return acc
                    }, [])}

                    <div className="absolute bottom-3 space-y-2">
                        <ModeToggle align='start' className='rounded-full hover:bg-gray-200 dark:hover:bg-gray-800' label={isFull}/>

                        <div className='p-2 rounded-full cursor-pointer flex items-center justify-center border hover:bg-gray-200 dark:hover:bg-gray-800' onClick={(e) => {e.stopPropagation();toggleSidebar(!isFull)}}>
                        {isFull && "Collapse"}
                        {isFull ? <ChevronLeft className="cursor-pointer size-4 ml-1"  /> : <ChevronRight className="cursor-pointer size-4 ml-1" />}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl border bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900 shadow">
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
                    <div className="flex flex-col items-center space-y-1.5 p-3 max-w-[calc(100vw-68px)] rounded-xl border bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900 shadow">
                        <BreadcrumbNav/>
                    </div>
                </div>
                <Card className="p-2 flex-1 overflow-y-auto w-full bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className='px-2'>
                        <Tabs defaultValue={''} value={type} onValueChange={(value) => navigate(`/${value}`)}>
                            <Routes>
                                <Route index element={
                                    <ManageStudentsMenu/>
                                } />
                                <Route path="/" element={
                                    <TabsContent value="">
                                        <ManageStudentsMenu/>
                                    </TabsContent>
                                } />
                                <Route path="/dashboard" element={
                                    <TabsContent value="">
                                        <ManageStudentsMenu/>
                                    </TabsContent>
                                } />
                                <Route path="papers/*" element={
                                    <PapersRoutesWithModals/>
                                } />
                                <Route path="scholarship/*" element={
                                    <ScholarshipRoutesWithModals/>
                                } />
                                <Route path="students/*" element={
                                    <Routes>
                                        <Route index element={
                                            <StudentList/>
                                        } />
                                        <Route path="edit" element={
                                            <TabsContent value="edit">
                                                <EditStudent/>
                                            </TabsContent>
                                        } />
                                        <Route path="search" element={
                                            <TabsContent value="search">
                                                <SearchStudent/>
                                            </TabsContent>
                                        } />
                                        <Route path=":reg_no/*" element={
                                            <Routes>
                                                <Route index element={
                                                    <StudentView/>
                                                } />
                                                <Route path="edit" element={
                                                    <TabsContent value="edit">
                                                        <EditStudent/>
                                                    </TabsContent>
                                                } />
                                            </Routes>
                                        } />
                                        {/* <Route path="*" element={
                                            <Error404Page/>
                                        } /> */}
                                    </Routes>
                                } />
                                <Route path="diets/*" element={
                                    <Routes>
                                        <Route index element={
                                            <TabsContent value="diets">
                                                <DietPage all={false} />
                                            </TabsContent>
                                        } />
                                        <Route path="all" element={
                                            <TabsContent value="all">
                                                <DietPage all={true} />
                                            </TabsContent>
                                        } />
                                        <Route path=":diet_name" element={
                                            <Routes>
                                                <Route index element={
                                                    <DietView />
                                                } />
                                            </Routes>
                                        } />
                                        <Route path="create" element={
                                            <TabsContent value="create">
                                                <DietCreate />
                                            </TabsContent>
                                        } />
                                        <Route path=":diet_name/*" element={
                                            <Routes>
                                                <Route path='edit' element={
                                                    <DietEdit />
                                                } />
                                                <Route path='*' element={
                                                    <DietView />
                                                } />
                                            </Routes>
                                        } />
                                    </Routes>
                                } />
                                <Route path="payments" element={
                                    <TabsContent value="payments">
                                        <PaymentsPage />
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