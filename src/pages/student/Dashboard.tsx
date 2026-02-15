import { Card, CardContent, } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { BookOpen, ChevronLeft, ChevronRight, CreditCard, GraduationCap, Home, Library, Settings, User, Menu, Loader2, AlertCircle, CheckCircle, XCircle, Download, Folder, FileText, Link2, Mail, Phone, MapPin, Calendar, Badge, DollarSign, Award } from 'lucide-react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import Error404Page from '@/components/404';
import { cn } from '@/lib/utils';
import PapersRegistration from './PapersRegistration';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Paper } from '@/lib/data';
import { AxiosError } from 'axios';
import { api } from '@/lib/api';
import { updateUserProfile, UserState } from '@/redux/userSlice';
import { ModeToggle } from '@/components/mode-toggle';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface AvProps {
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const DelayedMessage = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;
  return (
    <p className='text-muted-foreground'>It seems the response is taking a lot of time. Please you can reload the page.</p>
  );
}

type CoursePageItems = {
  title: string;
  description: string;
  path: string;
}[]

const HomePageItems = [
  {
    title: "Papers", 
    description: "Visit the papers page",
    path: "/papers"
  },
  {
    title: "Payments",
    description: "Visit the payments page",
    path: "/payments"
  }
]

const CoursePageItems = [
  {
    title: "Register",
    description: "Register for a paper",
    path: "/papers/register"
  },
  {
    title: "My Papers", 
    description: "View your registered papers",
    path: "/papers/view"
  },
  {
    title: "View",
    description: "View available papers",
    path: "/papers/available"
  },
  {
    title: "Print Papers",
    description: "Print paper materials",
    path: "/papers/print"
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
  const isMyStudyRoute = location.pathname.includes('/my-study')
  const type = isMyStudyRoute ? 'my-study' : location.pathname.split('/').pop()
  const [isFull, setIsFull] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const sidebar = localStorage.getItem('sidebar')
    if (sidebar) toggleSidebar(JSON.parse(sidebar))
  })
  
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

  const sideItems = useMemo(() => [
    {
      title: "Home",
      icon: <Home className={`size-4 ${isFull && 'mr-1'}`} />,
      path: "/home"
    },
    {
      title: "My Study",
      icon: <BookOpen className={`size-4 ${isFull && 'mr-1'}`} />,
      path: "/my-study",
      description: "Visit the my study page"
    },
    {
      title: "Papers", 
      icon: <BookOpen className={`size-4 ${isFull && 'mr-1'}`} />,
      path: "/papers",
      description: "Visit the papers page"
    },
    {
      title: "Payments", 
      icon: <CreditCard className={`size-4 ${isFull && 'mr-1'}`} />,
      path: "/payments",
      description: "Visit the payments page"
    },
    {
      title: "Profile",
      icon: <User className={`size-4 ${isFull && 'mr-1'}`} />,
      path: "/profile",
      description: "Visit the profile page"
    },
    {
      title: "Resources",
      icon: <Library className={`size-4 ${isFull && 'mr-1'}`} />,
      path: "/resources",
      description: "Visit the resources page"
    }
  ], [isFull])
  
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
                className={`flex ${type === item.title.toLowerCase() && isFull && 'bg-gray-200 dark:bg-gray-800'} ${isFull ? 'justify-start hover:bg-gray-200 dark:hover:bg-gray-800 p-2' : 'justify-center'} p-1 overflow-hidden rounded-full cursor-pointer relative w-full transition-colors ${(item.title === 'Papers' && !user.email_verified) || (item.title === 'Payments' && user.user_status === 'signee') ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => {
                  if (item.title === 'Papers') {
                    if (!user.email_verified) {
                      return;
                    }
                  }
                  navigate(item.path);
                }}
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
              ))}

              <div 
              className={`p-2 rounded-full cursor-pointer flex items-center 
                ${type === 'settings' && (isFull ? 'bg-gray-200 dark:bg-gray-800' : '!border-cyan-500')} 
                ${isFull ? 'hover:bg-gray-200 dark:hover:bg-gray-800 w-full justify-start' : 'justify-center group hover:!border-cyan-500 border border-slate-200 dark:border-slate-700'} 
                ${type === "settings" && "border-cyan-500"} 
                space-x-3`
              }
              onClick={() => navigate('/settings')}
              >
                <Settings className={`w-5 h-5 group-hover:text-cyan-500 ${type === 'settings' && !isFull && '!text-cyan-500'} ${type === "settings" && "text-cyan-500"}`} />
                {isFull && <span className='dark:text-white'>Settings</span>}
              </div>

              <div className="absolute bottom-3 space-y-2">
                <ModeToggle align='start' className='rounded-full hover:bg-gray-200 dark:hover:bg-gray-800' label={isFull}/>

                <div className='p-2 rounded-full cursor-pointer flex items-center justify-center border hover:bg-gray-200 dark:hover:bg-gray-800' onClick={(e) => {e.stopPropagation();toggleSidebar(!isFull)}}>
                  {isFull && "Collapse"}
                  {isFull ? <ChevronLeft className="cursor-pointer size-4 ml-1"  /> : <ChevronRight className="cursor-pointer size-4 ml-1" />}
                </div>
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
        
        <Card className="p-2 max-[640px]:p-0 border-none rounded-none bg-transparent dark:bg-transparent flex-1 overflow-y-auto w-full">
          <CardContent className='p-0 space-y-4'>

            {!location.pathname.includes('profile') && (
              <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg">
                        {user.profile_pic ? (
                          <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                            {(user.firstname || '').charAt(0)}{(user.lastname || '').charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3 text-center sm:text-left">
                      <div>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {user.firstname} {user.lastname}
                        </h5>
                        <p className="text-sm text-muted-foreground mt-1">Student Profile</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <div className="p-1.5 rounded-md bg-cyan-100 dark:bg-cyan-900/30">
                            <User className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="text-muted-foreground">Reg No:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{user.reg_no || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <div className="p-1.5 rounded-md bg-cyan-100 dark:bg-cyan-900/30">
                            <Mail className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{user.email || 'N/A'}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {user.email_verified ? (
                                  <CheckCircle className="size-4 text-green-500" />
                                ) : (
                                  <XCircle className="size-4 text-red-500" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.email_verified ? 'Email verified' : 'Email not verified'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      {!user.email_verified && (
                        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2 flex-1">
                            <AlertCircle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-300">
                              Your email is not verified. Please verify to access all features.
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate('/accounts/confirm-email')}
                            className="shrink-0 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40"
                          >
                            Verify Email
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Tabs defaultValue={'home'} value={type} onValueChange={(value) => navigate(`/${value}`)}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="home" element={
                  <TabsContent value="home">
                    <PapersPage menuItems={HomePageItems}/>
                  </TabsContent>
                } />
                <Route path="payments" element={
                  <TabsContent value="payments">
                    <PaymentHistoryPage />
                  </TabsContent>
                } />
                <Route path="profile" element={
                  <TabsContent value="profile">
                    <ProfilePage />
                  </TabsContent>
                } />
                <Route path="my-study/*" element={
                  <TabsContent value="my-study">
                    <Routes>
                      <Route path="/" element={<MyStudyPage />} />
                      <Route path=":dietName" element={<MyStudyPageForDiet />} />
                      <Route path=":dietName/:paperCode/*" element={<StudyFolderPage />} />
                      <Route path="*" element={<Error404Page title='My Study page' />} />
                    </Routes>
                  </TabsContent>
                } />
                <Route path="papers/*" element={
                  <Routes>
                    <Route path="/" element={<PapersPage menuItems={CoursePageItems}/>} />
                    <Route path="register" element={
                      <TabsContent value="register">
                        <PapersRegistration/>
                      </TabsContent>
                    } />
                    <Route path="view" element={
                      <TabsContent value="view">
                        <PapersList/>
                      </TabsContent>
                    } />
                    <Route path="available" element={
                      <TabsContent value="available">
                        <AvailablePapers/>
                      </TabsContent>
                    } />
                    <Route path="print" element={
                      <TabsContent value="print">
                        <PapersPage menuItems={CoursePageItems}/>
                      </TabsContent>
                    } />
                    <Route path="payment-status" element={
                      <TabsContent value="payment-status">
                        <PaymentStatus/>
                      </TabsContent>
                    } />
                  </Routes>
                } />
                <Route path="settings" element={
                  <TabsContent value="settings">
                    {user.email_verified && <SettingsPage />}
                  </TabsContent>
                } />
                <Route path="*" element={
                  <Error404Page title='Dashboard' />
                } />
              </Routes>
            </Tabs>
            
            {/* <section>
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
            </section> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type StudyPaperItem = {
  code: string;
  name: string;
  diet: string;
}

type StudyDirItem = {
  name: string;
  path: string;
  type: "dir" | "url" | "file" | "test";
  url?: string;
}

const MyStudyPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user)

  const groupedPapers = useMemo(() => {
    const grouped: Record<string, StudyPaperItem[]> = {};
    (user.papers ?? []).forEach((entry) => {
      const entryRecord = entry as Record<string, string[] | string | undefined>;
      const code = Object.keys(entryRecord)[0];
      const rawValue = entryRecord?.[code];
      let paperName = '';
      let dietName = '';

      if (Array.isArray(rawValue)) {
        [paperName, dietName] = rawValue;
      } else if (typeof rawValue === 'string') {
        const parsed = rawValue.split('|').map((segment) => segment.trim());
        if (parsed.length >= 2) {
          paperName = parsed[0];
          dietName = parsed.slice(1).join(' | ');
        } else {
          paperName = rawValue;
        }
      }

      const entryDiet = (entry as { diet?: string; diet_name?: string }).diet
        || (entry as { diet?: string; diet_name?: string }).diet_name
        || '';
      if (!dietName && entryDiet) {
        dietName = entryDiet;
      }

      if (!code) return;
      if (!dietName) {
        dietName = 'Unassigned';
      }
      if (!grouped[dietName]) {
        grouped[dietName] = [];
      }
      grouped[dietName].push({
        code,
        name: paperName || code,
        diet: dietName
      });
    });
    return grouped;
  }, [user.papers]);

  const diets = Object.entries(groupedPapers);

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold">My Study</h2>
              <span className="text-sm text-muted-foreground">
                {diets.length} {diets.length === 1 ? 'diet' : 'diets'}
              </span>
            </div>

            {diets.length === 0 ? (
              <div className="flex flex-col justify-center items-center gap-2 h-[40vh]">
                <AlertCircle className="w-10 h-10" />
                <p className="text-muted-foreground">No papers found</p>
                <Button variant="outline" onClick={() => navigate('/papers/register')}>
                  Register for Papers
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {diets.map(([dietName, papers]) => (
                  <div key={dietName} className="space-y-3">
                    <h3 className="text-lg font-medium">{dietName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {papers.map((paper) => (
                        <Link
                          key={`${paper.code}-${paper.diet}`}
                          to={`/my-study/${encodeURIComponent(paper.diet)}/${encodeURIComponent(paper.code)}`}
                          className="block p-4 border rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Folder className="w-5 h-5 text-cyan-500" />
                            <div className="space-y-1">
                              <p className="font-medium">{paper.name}</p>
                              <p className="text-xs text-muted-foreground">{paper.code}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const MyStudyPageForDiet = () => {
  const navigate = useNavigate();
  const { dietName } = useParams();
  const user = useSelector((state: RootState) => state.user)
  const resolvedDietName = decodeURIComponent(dietName || '');

  const papersForDiet = useMemo(() => {
    const papers: StudyPaperItem[] = [];
    (user.papers ?? []).forEach((entry) => {
      const entryRecord = entry as Record<string, string[] | string | undefined>;
      const code = Object.keys(entryRecord)[0];
      const rawValue = entryRecord?.[code];
      let paperName = '';
      let entryDiet = '';

      if (Array.isArray(rawValue)) {
        [paperName, entryDiet] = rawValue;
      } else if (typeof rawValue === 'string') {
        const parsed = rawValue.split('|').map((segment) => segment.trim());
        if (parsed.length >= 2) {
          paperName = parsed[0];
          entryDiet = parsed.slice(1).join(' | ');
        } else {
          paperName = rawValue;
        }
      }

      const fallbackDiet = (entry as { diet?: string; diet_name?: string }).diet
        || (entry as { diet?: string; diet_name?: string }).diet_name
        || '';

      const normalizedDiet = entryDiet || fallbackDiet;
      if (!code || !normalizedDiet) return;
      if (normalizedDiet !== resolvedDietName) return;

      papers.push({
        code,
        name: paperName || code,
        diet: normalizedDiet
      });
    });

    return papers;
  }, [resolvedDietName, user.papers]);

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{resolvedDietName || 'Diet Papers'}</h2>
                <p className="text-sm text-muted-foreground">Select a paper to view materials</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/my-study')}>
                Back to My Study
              </Button>
            </div>

            {papersForDiet.length === 0 ? (
              <div className="flex flex-col justify-center items-center gap-2 h-[40vh]">
                <AlertCircle className="w-10 h-10" />
                <p className="text-muted-foreground">No papers found for this diet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {papersForDiet.map((paper) => (
                  <Link
                    key={`${paper.code}-${paper.diet}`}
                    to={`/my-study/${encodeURIComponent(paper.diet)}/${encodeURIComponent(paper.code)}`}
                    className="block p-4 border rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-cyan-500" />
                      <div className="space-y-1">
                        <p className="font-medium">{paper.name}</p>
                        <p className="text-xs text-muted-foreground">{paper.code}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const StudyFolderPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const resolvedDietName = decodeURIComponent(params.dietName || '');
  const resolvedPaperCode = decodeURIComponent(params.paperCode || '');
  const extraPath = params["*"] || '';
  const relativeSegments = extraPath
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));
  const rootPathLabel = `${resolvedPaperCode} ${resolvedDietName}`;
  const currentPath = `/${rootPathLabel}${relativeSegments.length ? `/${relativeSegments.join('/')}` : ''}`;
  const [items, setItems] = useState<StudyDirItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [fileItem, setFileItem] = useState<StudyDirItem | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const openFileDialog = useCallback((item: StudyDirItem) => {
    setFileItem(item);
    setFileDialogOpen(true);
    setFileError(null);
    setFileLoading(true);
  }, []);

  const closeFileDialog = useCallback(() => {
    setFileDialogOpen(false);
    setFileItem(null);
    setFileError(null);
  }, []);

  useEffect(() => {
    if (!fileDialogOpen || !fileItem || fileItem.type !== 'file') return;
    let revoked = false;
    const controller = new AbortController();
    api.get('/view-file', { params: { file_name: fileItem.name }, responseType: 'blob', signal: controller.signal })
      .then((res) => {
        if (revoked) return;
        const fileUrl = URL.createObjectURL(res.data as Blob);
        const wrapperHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
          html, body { margin: 0; height: 100%; overflow: hidden; }
          iframe { width: 100%; height: 100%; border: none; }
          @media print { html, body, * { display: none !important; } }
        </style></head><body><iframe src="${fileUrl}" title="File"></iframe></body></html>`;
        const wrapperBlob = new Blob([wrapperHtml], { type: 'text/html' });
        const wrapperUrl = URL.createObjectURL(wrapperBlob);
        window.open(wrapperUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(wrapperUrl), 1000);
        setFileLoading(false);
        setFileDialogOpen(false);
        setFileItem(null);
        setFileError(null);
      })
      .catch((err) => {
        if (revoked) return;
        setFileError(err?.response?.data?.message ?? 'Failed to load file');
        setFileLoading(false);
      });
    return () => {
      revoked = true;
      controller.abort();
    };
  }, [fileDialogOpen, fileItem]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!resolvedDietName || !resolvedPaperCode) {
        setError('Missing paper details');
        setIsLoading(false);
        return;
      }

      try {
        setError('');
        setIsLoading(true);
        const response = await api.get(`/view-dir?path=${encodeURIComponent(currentPath)}`);
        setItems(response.data || []);
      } catch (error) {
        if (error instanceof Error) {
          const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data
          if (message && typeof message !== 'object') {
            setError(message)
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, description] = Object.entries(message as unknown as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
          setError(description)
        } else if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { error: string } } }
          console.error('API Error:', axiosError.response.data.error)
          setError(axiosError.response.data.error)
        } else {
          console.error('Unexpected error:', error)
          setError('An unexpected error occurred')
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [currentPath, resolvedDietName, resolvedPaperCode]);

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{resolvedPaperCode || 'Study Folder'}</h2>
                <p className="text-sm text-muted-foreground">{resolvedDietName}</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/my-study')}>
                Back to My Study
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-[40vh]">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex justify-center gap-2 items-center h-[40vh]">
                <AlertCircle className="w-10 h-10" />
                <p className="text-muted-foreground mb-0">{error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex justify-center items-center h-[40vh]">
                <p className="text-muted-foreground">No materials found</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((item) => {
                  const isExternalLink = item.type === 'url' && item.url;
                  const isFile = item.type === 'file';
                  const showOpen = isExternalLink || isFile;
                  const icon = item.type === 'dir'
                    ? <Folder className="w-5 h-5 text-cyan-500" />
                    : item.type === 'url'
                      ? <Link2 className="w-5 h-5 text-cyan-500" />
                      : <FileText className="w-5 h-5 text-cyan-500" />;
                  const pathLabel = item.type === 'url' && !isExternalLink ? '/my-study'+item.path : '';

                  const row = (
                    <div className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        {icon}
                        <div className="space-y-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.type}{pathLabel ? ` • ${pathLabel}` : ''}
                          </p>
                        </div>
                      </div>
                      {showOpen && (
                        <span className="text-xs text-cyan-600">Open</span>
                      )}
                      {item.type === 'test' && (
                        <span className="text-xs text-cyan-600">Take test</span>
                      )}
                    </div>
                  );

                  if (item.type === 'url' && item.url) {
                    return (
                      <a key={item.path} href={item.url} target="_blank" rel="noreferrer">
                        {row}
                      </a>
                    );
                  }

                  if (item.type === 'file') {
                    return (
                      <div
                        key={item.path}
                        role="button"
                        tabIndex={0}
                        onClick={() => openFileDialog(item)}
                        onKeyDown={(e) => e.key === 'Enter' && openFileDialog(item)}
                        className="cursor-pointer"
                      >
                        {row}
                      </div>
                    );
                  }

                  if (item.type === 'dir' || item.type === 'url') {
                    const backendSegments = item.path.split('/').filter(Boolean);
                    const matchesRoot = backendSegments[0] === rootPathLabel;
                    const derivedSegments = matchesRoot
                      ? backendSegments.slice(1)
                      : [...relativeSegments, item.name];
                    const uiPath = `/my-study/${encodeURIComponent(resolvedDietName)}/${encodeURIComponent(resolvedPaperCode)}${derivedSegments.length ? `/${derivedSegments.map((segment) => encodeURIComponent(segment)).join('/')}` : ''}`;

                    return (
                      <Link key={item.path} to={uiPath}>
                        {row}
                      </Link>
                    );
                  }

                  if (item.type === 'test') {
                    const testPath = item.path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
                    return (
                      <Link key={item.path} to={`/test/${testPath}`}>
                        {row}
                      </Link>
                    );
                  }

                  return (
                    <div key={item.path}>
                      {row}
                    </div>
                  );
                })}
              </div>
            )}

            <Dialog open={fileDialogOpen} onOpenChange={(open) => { setFileDialogOpen(open); if (!open) closeFileDialog(); }}>
              <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>{fileItem?.name ?? 'File'}</DialogTitle>
                </DialogHeader>
                {fileLoading && (
                  <p className="text-muted-foreground">Please wait while the file is being received.</p>
                )}
                {fileError && (
                  <p className="text-destructive">{fileError}</p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const AvailablePapers = () => {
  const user = useSelector((state: RootState) => state.user)
  const [papers, setPapers] = useState<Paper[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const count = useRef(0);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        count.current += 1;
        setIsLoading(true);
        const response = await api.get('/courses?reg=false' + (user.user_status === 'student' ? '' : "&acca_reg=" + (user.acca_reg || '001')) + '&user_status=' + user.user_status + '&email=' + user.email);
        setPapers(response.data);
      } catch (error) {
        if (error instanceof Error) {
          const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
          if (message && typeof message !== 'object') {
            setError(message)
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
          setError(description)
        } else if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { error: string } } }
          console.error('API Error:', axiosError.response.data.error)
          setError(axiosError.response.data.error)
        } else {
          console.error('Unexpected error:', error)
          setError('An unexpected error occurred')
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (isLoading && count.current === 0) fetchPapers();
  }, [isLoading, user.acca_reg, user.email, user.user_status]);

  const groupedPapers = papers?.reduce((acc, paper) => {
    if (!acc[paper.category]) {
      acc[paper.category] = [];
    }
    acc[paper.category].push(paper);
    return acc;
  }, {} as { [key: string]: Paper[] });

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Available Papers</h2>
                <p className="text-sm text-muted-foreground mt-1">Browse and explore courses available for registration</p>
              </div>
              {!isLoading && !error && Object.keys(groupedPapers ?? {}).length > 0 && (
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {papers.length} paper{papers.length !== 1 ? 's' : ''} available
                </span>
              )}
            </div>

            {isLoading && (
              <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                <p className="text-muted-foreground">Loading papers...</p>
                <DelayedMessage />
              </div>
            )}

            {error && (
              <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
                <div className="p-4 rounded-full bg-destructive/10">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <p className="text-muted-foreground text-center max-w-md">{error}</p>
              </div>
            )}

            {!isLoading && !error && Object.entries(groupedPapers ?? {}).length === 0 && (
              <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
                <div className="p-4 rounded-full bg-muted">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No papers found</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="space-y-8">
                {Object.entries(groupedPapers ?? {}).map(([category, papers]) => (
                  <div key={category+papers.length} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 bg-cyan-500 rounded-full" />
                      <div>
                        <h3 className="text-lg font-semibold">{category}</h3>
                        <p className="text-xs text-muted-foreground">{papers.length} paper{papers.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {papers.map((paper) => (
                        <div 
                          key={paper.code[0]+paper.name} 
                          className="group p-5 border rounded-xl bg-white dark:bg-gray-800/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="font-medium leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {paper.name}
                            </h4>
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded shrink-0">
                              {paper.code}
                            </span>
                          </div>
                          {Array.isArray(paper.type) && paper.type.length > 0 && Array.isArray(paper.price) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {paper.type?.map((t: string, idx: number) => (
                                <span 
                                  key={t + idx} 
                                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800"
                                >
                                  {t || 'Standard'}: ₦{(t === '' ? paper.price?.[0] : paper.price?.[idx])?.toLocaleString()}
                                </span>
                              ))}
                            </div>
                          )}
                          {paper.type?.length === 0 && paper.price?.length > 0 && (
                            <div className="mt-3">
                              <span className="inline-flex items-center text-sm font-medium text-cyan-600 dark:text-cyan-400">
                                ₦{paper.price?.[0]?.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const PapersList = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-white via-white to-cyan-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8">
          <div className="space-y-2">
            <div>
              <h2 className="text-2xl font-semibold">My Papers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.papers?.map((paper) => {
                const paperCode = Object.keys(paper)[0] ?? 'Paper';
                const details = Object.values(paper)[0];
                const detailList = Array.isArray(details)
                  ? details
                  : details
                    ? [String(details)]
                    : [];

                return (
                  <div key={paperCode} className="p-4 border rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <h3 className="text-lg font-medium">{paperCode}</h3>
                    {detailList.map((value: string, index: number) => (
                      <p key={`${paperCode}-${index}`} className="text-muted-foreground">
                        {index === 0 ? 'Name: ' : index === 1 ? 'Diet: ' : ''}
                        {value}
                      </p>
                    ))}
                  </div>
                );
              })}
              {user.papers?.length > 0 ? null : (
                <div className="flex flex-col justify-center items-center gap-2 h-[50vh] col-span-2">
                  <AlertCircle className="w-10 h-10" />
                  <p className="text-muted-foreground">No papers found</p>
                  <Button variant="outline" onClick={() => navigate('/papers/register', { replace: true })}>Register for Papers</Button>
                </div>
              )}
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
    )
}

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const dispatch = useDispatch();
  const count = useRef(0);

  const verifyPayment = useCallback(async (reference: string) => {
    if (!reference) {
      navigate("/papers/", { replace: true })
      return
    }

    try {
      const response = await api.get(`/verify/${reference}`);

      switch (response.status) {
        case 200:
        {
          toast.success(response.data.status || "Payment Successful!",{
            description: response.data.message || "Your payment has been successfully processed."
          })
          dispatch(updateUserProfile({ 
            acca_reg: response.data.acca_reg_no || response.data.user_data.acca_reg_no, 
            reg_no: response.data.reg_no || response.data.user_data.reg_no, 
            fee: response.data?.fee || response.data.user_data?.fee,
            user_status: response.data.user_status || response.data.user_data.user_status,
            papers: response.data.papers || response.data.user_data.papers
          }))
          localStorage.removeItem('reference');
          const additional_info = JSON.parse(localStorage.getItem('additional_info_draft') || '{}')
          localStorage.setItem('additional_info_draft', JSON.stringify({ ...additional_info, acca_reg_no: response.data.acca_reg_no || response.data.user_data.acca_reg_no }))
          navigate("/papers/view", { replace: true })
          break;
        }
        case 202:
          toast.info(response.data.status || "Payment Pending",{
            description: response.data.message || "Your payment is pending. Please wait while we verify your payment.",
          })
          break;
        default:
          toast.error(response.data.status || "Payment Verification Failed",{
            description: response.data.message || "There was an error verifying your payment."
          })
          break;
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
      if (error instanceof Error) {
        const message = (error as AxiosError<{ error: { [x: string]: string } }>).response?.data?.error
         
        const [title, description] = Object.entries(message as { [x: string]: string })[0] || ['Error', 'An unexpected error occurred']
        toast.error("Error",{
          description: title.includes("Uncaught Error") ? "An unexpected error occurred" : description
        })
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } }
        console.error('API Error:', axiosError.response.data.error)
        toast.error("Error",{
          description: axiosError.response.data.error
        })
      } else {
        console.error('Unexpected error:', error)
        toast.error("Error",{
          description: "An unexpected error occurred"
        })
      }
    } finally {
      // setIsVerifying(false)
    }
  }, [dispatch, navigate])

  useEffect(() => {
    if (reference && count.current === 0) {
      count.current += 1;
      verifyPayment(reference)
    }
  }, [reference, verifyPayment]);
        

  return (
    <div>
      <h1>Payment Status</h1>
      <div className="flex flex-col justify-center items-center gap-2 h-[50vh] col-span-2">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-muted-foreground">Please wait for your payment to be confirmed</p>
        <DelayedMessage />
      </div>
    </div>
  )
}

const PapersPage = ({ menuItems }:{ menuItems: CoursePageItems }) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <div className="w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path === '/papers/register' && !user.email_verified ? '/accounts/confirm-email' : item.path}
              className={`block p-6 max-[639px]:text-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ${(item.title === 'Papers' && !user.email_verified) || (item.title === 'Payments' && user.user_status === 'signee') ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
              <p className="font-normal ">{item.title === 'Papers' && !user.email_verified ? 'Please verify your email to register for papers' : item.description}</p>
            </Link>
          ))}
        </div>
      </div>
  )
}

export const PaymentHistoryPage = ({ student }: { student?: UserState }) => {
  const user = useSelector((state: RootState) => state.user)
  const effectiveUser = student || user
  const [payments, setPayments] = useState<{ papers: string[]; ref_id: string; amount: number; date: string }[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('')
  const count = useRef(0)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        count.current += 1
        setIsLoading(true)
        const response = await api.get('/all-payments', {
          params: { reg_no: effectiveUser.reg_no }
        })
        setPayments(response.data)
      } catch (error) {
        if (error instanceof Error) {
          const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
          if (message && typeof message !== 'object') {
            setError(message)
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
          setError(description)
        } else if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { error: string } } }
          console.error('API Error:', axiosError.response.data.error)
          setError(axiosError.response.data.error)
        } else {
          console.error('Unexpected error:', error)
          setError('An unexpected error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }
    if (effectiveUser.reg_no && count.current === 0) fetchPayments()
  }, [effectiveUser.reg_no])

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-muted-foreground">No payment records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Reference</th>
                    <th className="py-2 px-4 text-left">Papers</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr key={payment.ref_id + idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-2 px-4">{new Date(payment.date).toLocaleString()}</td>
                      <td className="py-2 px-4">{payment.ref_id}</td>
                      <td className="py-2 px-4">{payment.papers.join(', ')}.</td>
                      <td className="py-2 px-4">₦{payment.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ReceiptsCard />

      <div className="text-center text-sm text-muted-foreground">
        Note: Payments are processed through our secure payment gateway. If you have any issues, please contact support.
      </div>
    </div>
  )
}

const ReceiptsCard = () => {
  const user = useSelector((state: RootState) => state.user)
  const [receipts, setReceipts] = useState<{ receipt_no: string; papers: string[]; amount: number; date: string }[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [isReceiptLoading, setIsReceiptLoading] = useState('');
  const [error, setError] = useState('')
  const count = useRef(0)

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        count.current += 1
        setIsLoading(true)
        const response = await api.get('/receipts', {
          params: { reg_no: user.reg_no }
        })
        setReceipts(response.data)
      } catch (error) {
        if (error instanceof Error) {
          const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
          if (message && typeof message !== 'object') {
            setError(message)
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
          setError(description)
        } else if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { error: string } } }
          setError(axiosError.response.data.error)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }
    if (user.reg_no && count.current === 0) fetchReceipts()
  }, [user.reg_no])

  const getReceipt = async (receipt: typeof receipts[0]) => {
    try {
      setIsReceiptLoading(receipt.receipt_no);
      const res = await api.get('/receipt', {
        params: { receipt_no: receipt.receipt_no },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${receipt.receipt_no}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error) {
        const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
        if (message && typeof message !== 'object') {
          setError(message)
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
        setError(description)
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } }
        console.error('API Error:', axiosError.response.data.error)
        setError(axiosError.response.data.error)
      } else {
        console.error('Unexpected error:', error)
        setError('An unexpected error occurred')
      }
    } finally {
      setIsReceiptLoading('');
    }
  }

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Receipts</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-muted-foreground">No receipts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Receipt No</th>
                  <th className="py-2 px-4 text-left">Papers</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, idx) => (
                  <tr key={receipt.receipt_no + idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2 px-4">{new Date(receipt.date).toLocaleString()}</td>
                    <td className="py-2 px-4">{receipt.receipt_no}</td>
                    <td className="py-2 px-4">{receipt.papers.join(', ')}.</td>
                    <td className="py-2 px-4">₦{receipt.amount.toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => getReceipt(receipt)} 
                        disabled={isReceiptLoading === receipt.receipt_no}
                      >
                        {isReceiptLoading === receipt.receipt_no ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user)
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700 h-32"></div>
                <CardContent className="p-4 -mt-16">
                  <div className="space-y-6">
                      <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                              <Avatar className="w-full h-full">
                                <AvatarImage src={user.profile_pic} />
                                <AvatarFallback>
                                  {(user.firstname || '').split(' ')[0]?.[0] || ''}
                                  {(user.lastname || '').split(' ')[0]?.[0] || ''}
                                </AvatarFallback>
                              </Avatar>
                          </div>
                          <div className="flex-1 pb-2">
                              <h2 className="text-2xl font-bold text-white">{user.firstname} {user.lastname}</h2>
                              <p className="text-muted-foreground">{user.reg_no || 'N/A'}</p>
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <div className="flex items-center gap-2 pb-2 border-b">
                                  <User className="w-5 h-5 text-cyan-500" />
                                  <h3 className="text-lg font-semibold">Personal Information</h3>
                              </div>
                              <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                      <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                                      <div className="flex-1">
                                          <p className="text-sm text-muted-foreground">Email</p>
                                          <div className="flex items-center gap-2">
                                              <p className="font-medium">{user.email}</p>
                                              {user.email_verified ? (
                                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                              ) : (
                                                  <XCircle className="w-4 h-4 text-red-500" />
                                              )}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                      <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                                      <div className="flex-1">
                                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                                          <p className="font-medium">
                                              {new Date(user.dob).toLocaleDateString('en-US', { 
                                                  year: 'numeric', 
                                                  month: 'long', 
                                                  day: 'numeric' 
                                              })}
                                          </p>
                                      </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                      <User className="w-4 h-4 text-muted-foreground mt-1" />
                                      <div className="flex-1">
                                          <p className="text-sm text-muted-foreground">Gender</p>
                                          <p className="font-medium capitalize">{user.gender}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                      <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                                      <div className="flex-1">
                                          <p className="text-sm text-muted-foreground">Phone</p>
                                          <p className="font-medium">{user.phone_no}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                      <div className="flex-1">
                                          <p className="text-sm text-muted-foreground">Address</p>
                                          <p className="font-medium">{user.address}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <div className="flex items-center gap-2 pb-2 border-b">
                                  <GraduationCap className="w-5 h-5 text-cyan-500" />
                                  <h3 className="text-lg font-semibold">Academic Details</h3>
                              </div>
                              <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                      <Badge className="w-4 h-4 text-muted-foreground mt-1" />
                                      <div className="flex-1">
                                          <p className="text-sm text-muted-foreground">User Status</p>
                                          <p className="font-medium capitalize">{user.user_status}</p>
                                      </div>
                                  </div>
                                  {user.acca_reg && (
                                      <div className="flex items-start gap-3">
                                          <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                                          <div className="flex-1">
                                              <p className="text-sm text-muted-foreground">ACCA Registration</p>
                                              <p className="font-medium">{user.acca_reg}</p>
                                          </div>
                                      </div>
                                  )}
                                  {user.scholarship && user.scholarship.length > 0 && (
                                      <div className="flex items-start gap-3">
                                          <Award className="w-4 h-4 text-muted-foreground mt-1" />
                                          <div className="flex-1">
                                              <p className="text-sm text-muted-foreground">Scholarship</p>
                                              <div className="flex flex-wrap gap-1 mt-1">
                                                  {user.scholarship.map((s, idx) => (
                                                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                                                          {s}
                                                      </span>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                  )}
                                  {user.fee && user.fee.length > 0 && (
                                      <div className="flex items-start gap-3">
                                          <DollarSign className="w-4 h-4 text-muted-foreground mt-1" />
                                          <div className="flex-1">
                                              <p className="text-sm text-muted-foreground">Fees</p>
                                              <div className="space-y-1 mt-1">
                                                  {user.fee.map((f, idx) => (
                                                      <div key={idx} className="flex items-center justify-between text-sm">
                                                          <span className="text-muted-foreground">{f.reason}</span>
                                                          <span className="font-medium">₦{f.amount.toLocaleString()}</span>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                  )}
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
  const navigate = useNavigate();
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
                  <Button variant="outline" size="sm" onClick={() => navigate('/accounts/reset-password')}>Change Password</Button>
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