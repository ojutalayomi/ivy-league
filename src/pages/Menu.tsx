import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { UsersRound } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "@/assets/ivyLight.png"
import LogoDark from "@/assets/ivyDark.png"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function Menu() {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home - Ivy League Associates";
  }, []);

  useEffect(() => {
    const timestamp = JSON.parse(localStorage.getItem('ivy_user_token') || '{}').timestamp;
    const isExpired = !timestamp || Date.now() - timestamp > 3600000;
    if (user.signed_in && !isExpired) {
      // navigate("/dashboard/home", { replace: true })
      toast({
        title: "You are signed in",
        description: "You are signed in to your account",
        variant: "default",
        action: <Button onClick={() => navigate("/dashboard/home")}>Go to Dashboard</Button>,
        duration: 10000
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const menuItems = [
    {
      title: "Sign In",
      description: "Access your account",
      path: "/accounts/signin"
    },
    {
      title: "Sign Up", 
      description: "Create a new account",
      path: "/accounts/signup"
    },
    ...((() => {
      return import.meta.env.VITE_NODE_ENV === 'development' ? [
        {
          title: "Manage Students",
          description: "Manage students",
          path: "/manage-students/"
        },
        {
          title: "Student Dashboard",
          description: "Go to student dashboard",
          path: "/student-dashboard/"
        }
      ] : [];
    })())
  ]

  return (
    <div className={`flex min-h-full flex-1 flex-col items-center justify-center px-6`}>
      <Card className="min-[641px]:min-w-[640px] mx-auto bg-transparent dark:bg-transparent border-none shadow-none sm:bg-white dark:sm:bg-gray-900 sm:border-1 sm:border-solid sm:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">
            Welcome to <br /> Ivy League Associates <br /> Student Portal
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">Please select an option to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center p-0 sm:p-6 sm:pt-0">
            {/* <div className="max-[640px]:flex hidden items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <UsersRound className="size-4" />
              </div>
              <span className="truncate font-semibold">IVY LEAGUE ASSOCIATES</span>
            </div> */}
            <div className="max-[640px]:hidden flex sm:w-full sm:h-full sm:max-w-sm">
              <img src={Logo} alt="Ivy League" className="dark:hidden w-80 h-80 mx-auto" />
              <img src={LogoDark} alt="Ivy League" className="hidden dark:block h-80 mx-auto" />
            </div>

          <div className="w-full sm:max-w-sm">
            <div className="grid gap-4">
              {menuItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.path}
                  className="block p-6 max-[639px]:text-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
