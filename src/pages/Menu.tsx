import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useUser } from "@/providers/user-provider"
import AccountsLayout from "@/components/AccountsLayout"

export default function Menu() {
  const { Mode } = useUser();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home - Ivy League Associates";
  }, []);

  useEffect(() => {
    const timestamp = JSON.parse(localStorage.getItem('ivy_user_token') || '{}').timestamp;
    const isExpired = !timestamp || Date.now() - timestamp > 3600000;
    if (user.signed_in && !isExpired) {
      // navigate("/", { replace: true })
      toast.success(<div className="flex justify-between gap-2 items-center"><p>You are signed in</p><Button onClick={() => navigate("/")}>Go to Dashboard</Button></div>)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const menuItems = [
    {
      title: "Sign In",
      description: "Access your account",
      path: "/accounts/signin"
    },
    ...((() => {
      return Mode === "student" ? [
        {
          title: "Sign Up", 
          description: "Create a new account",
          path: "/accounts/signup"
        }
      ] : [];
    })())
    ,
    ...((() => {
      return import.meta.env.VITE_NODE_ENV === 'development' ? [
        {
          title: Mode === "student" ? "Student Dashboard" : "Manage Students",
          description: Mode === "student" ? "Go to student dashboard" : "Manage students",
          path: "/"
        }
      ] : [];
    })())
  ]

  return (
    <AccountsLayout>
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
    </AccountsLayout>
  )
}
