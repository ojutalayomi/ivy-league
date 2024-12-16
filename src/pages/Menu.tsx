import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersRound } from "lucide-react"
import { Link } from "react-router-dom"
import Logo from "@/assets/ivyLight.jpeg"

export default function Menu() {
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
    {
      title: "Manage Students",
      description: "Manage students",
      path: "/manage-students/"
    }
  ]

  return (
    <div className={`bg-greybg-light-gradient bg-cover bg-center bg-no-repeat flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-cyan-500/20`}>
      <Card className="min-[641px]:min-w-[640px] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl/9 font-bold tracking-tight text-center text-cyan-500">Welcome to Ivy League Associates</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Please select an option to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex max-[640px]:flex-wrap gap-2 items-center justify-center">
          <div className="max-[640px]:flex hidden items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <UsersRound className="size-4" />
            </div>
            <span className="truncate text-xl font-semibold">IVY LEAGUE ASSOCIATES</span>
          </div>
          <div className="max-[640px]:hidden flex sm:w-full sm:h-full sm:max-w-sm">
            <img src={Logo} alt="Ivy League" className="w-80 h-80 mx-auto" />
          </div>

          <div className="max-[640px]:mt-8 sm:w-full sm:max-w-sm">
            <div className="grid gap-4">
              {menuItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.path}
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
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
