import { Card, CardContent, } from '@/components/ui/card';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { BookOpen, ChevronLeft, ChevronRight, CreditCard, GraduationCap, Home, Library, Settings, User, Menu } from 'lucide-react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import Error404Page from '@/components/404';
import { cn } from '@/lib/utils';
import CourseRegistration from './PapersRegistration';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface AvProps {
    active?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const CoursePageItems = [
  {
    title: "Register",
    description: "Register for a paper",
    path: "/student-dashboard/papers/register"
  },
  {
    title: "View Papers", 
    description: "View your registered papers",
    path: "/student-dashboard/papers/view"
  },
  {
    title: "Print Papers",
    description: "Print paper materials",
    path: "/student-dashboard/papers/print"
  }
]

const HomePageItems = [
  {
    title: "Papers", 
    description: "Visit the papers page",
    path: "/student-dashboard/papers"
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
    },
    {
      title: "Additional Info",
      description: "Visit the additional info page",
      path: "/accounts/additional-info"
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
    const user = useSelector((state: RootState) => state.user)
    
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
        title: "Papers", 
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
                onClick={toggleMobileSidebar}
            >

                <Link to="/">
                  <div className={`flex flex-col items-center space-y-1.5 ${isFull ? 'p-4' : 'p-3'} rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground shadow`}>
                      {isFull ? 
                        <div className={`font-semibold leading-none tracking-tight ${!isFull && 'overflow-hidden'}`}>
                          Ivy League Associates
                        </div> : 
                        <GraduationCap className='size-6'/>
                      }
                  </div>
                </Link>

                <div className={`flex flex-col flex-1 items-center gap-2 ${isFull ? 'p-2 rounded-3xl' : 'px-1 py-2 rounded-[2rem]'} text-sm border bg-card dark:bg-gray-900 dark:border-gray-700 text-card-foreground relative shadow`}>

                    
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

                    <div className='absolute bottom-3 p-2 rounded-full cursor-pointer flex items-center border hover:bg-gray-200 dark:hover:bg-gray-800' onClick={(e) => {e.stopPropagation();toggleSidebar(!isFull)}}>
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

                  {!location.pathname.includes('profile') && (<div className="block space-y-4 p-6 max-[639px]:text-center hover:border-cyan-500 bg-cyan-100/30 backdrop-blur-sm hover:bg-cyan-100/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md border">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="space-y-2">
                        <h5 className="text-xl font-bold tracking-tight dark:text-white">{user.firstname} {user.lastname}</h5>
                        <p className="font-normal dark:text-white">Registration Number: <b>{user.reg_no || 'N/A'}</b></p>
                        <p className="font-normal dark:text-white">Email: <b>{user.email || 'N/A'}</b></p>
                      </div>
                    </div>
                  </div>)}

                  <Tabs defaultValue={'home'} value={type} onValueChange={(value) => navigate(`/student-dashboard/${value}`)}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/student-dashboard/home" replace />} />
                        <Route path="home" element={
                          <TabsContent value="home">
                            <PapersPage menuItems={HomePageItems}/>
                          </TabsContent>
                        } />
                        <Route path="profile" element={
                          <TabsContent value="profile">
                            <ProfilePage />
                          </TabsContent>
                        } />
                        <Route path="papers/*" element={
                          <Routes>
                            <Route path="/" element={<PapersPage menuItems={CoursePageItems}/>} />
                            <Route path="register" element={
                              <TabsContent value="register">
                                <CourseRegistration/>
                              </TabsContent>
                            } />
                            <Route path="view" element={
                              <TabsContent value="view">
                                <PapersPage menuItems={CoursePageItems}/>
                              </TabsContent>
                            } />
                            <Route path="print" element={
                              <TabsContent value="print">
                                <PapersPage menuItems={CoursePageItems}/>
                              </TabsContent>
                            } />
                          </Routes>
                        } />
                        <Route path="*" element={
                          <Error404Page/>
                        } />
                        <Route path="settings" element={
                          <TabsContent value="settings">
                            {user.reg_no && <SettingsPage />}
                          </TabsContent>
                        } />
                      </Routes>
                  </Tabs>
                  
                  <section>
                    <details className="bg-white dark:bg-gray-800 border border-blue-500 p-6 rounded-lg">
                      <summary className="cursor-pointer text-lg font-medium">
                        Announcements
                      </summary>
                      <div className="mt-4 space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">Welcome to the new student dashboard! We're excited to have you here.</p>
                        <p className="text-gray-700 dark:text-gray-300">Registration for the next semester opens on January 15th, 2025.</p>
                        <p className="text-gray-700 dark:text-gray-300">Check out our new paper materials in the Resources section.</p>
                      </div>
                    </details>
                  </section>
                </CardContent>
              </Card>
            </div>
        </div>
    )
}

const PapersPage = ({ menuItems }:{ menuItems: typeof CoursePageItems }) => {
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Dialog open={user.user_status === 'signee' && location.pathname.includes('papers')} onOpenChange={() => {}}>
          <DialogContent className='dark:bg-gray-900 dark:border-gray-700'>
            <DialogHeader>
              <DialogTitle>
                Registration Status
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              You need to complete your registration to access this page.
            </DialogDescription>
            <DialogFooter className='flex flex-row sm:justify-center'>
              <Button className='bg-cyan-500 hover:bg-cyan-400 text-white' variant="outline" onClick={() => navigate('/accounts/additional-info')}>
                Complete Registration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user)
    return (
        <div className="space-y-8">
            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100/30 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold">{user.firstname} {user.lastname}</h2>
                            <p className="text-muted-foreground">{user.reg_no}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Personal Information</h3>
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium min-w-24">Email:</span>
                                        <span className="text-muted-foreground">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium min-w-24">Date of Birth:</span>
                                        <span className="text-muted-foreground">
                                            {new Date(user.dob).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium min-w-24">Gender:</span>
                                        <span className="text-muted-foreground capitalize">
                                            {user.gender}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Academic Details</h3>
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium min-w-24">User Status:</span>
                                      <span className="text-muted-foreground capitalize">
                                          {user.user_status}
                                      </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const SettingsPage = () => {
    const user = useSelector((state: RootState) => state.user)
    return (
        <div className="space-y-6">
            
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span>Email Address</span>
                                    <span className="text-muted-foreground">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Password</span>
                                    <Button variant="outline" size="sm">Change Password</Button>
                                </div>
                            </div>
                        </div>

                        {/* <div>
                            <h2 className="text-lg font-semibold mb-2">Preferences</h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span>Theme</span>
                                    <span className="text-muted-foreground capitalize">
                                        {student.preferences?.theme}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Language</span>
                                    <span className="text-muted-foreground capitalize">
                                        {student.preferences?.language}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Notifications</span>
                                    <span className="text-muted-foreground capitalize">
                                        {student.preferences?.notifications}
                                    </span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}