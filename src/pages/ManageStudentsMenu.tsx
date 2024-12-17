import { Link } from "react-router-dom"
import Logo from "@/assets/ivyLight.png"
import { UsersRound } from "lucide-react"
import { useEffect } from "react";

/**
 * ManageStudentsMenu Component
 * 
 * A component that displays a menu for managing students in the Ivy League Associates system.
 * 
 * Features:
 * - Displays a welcoming interface with the Ivy League Associates logo
 * - Provides navigation options for different student management tasks
 * - Responsive design that adapts to different screen sizes
 * 
 * Menu Options:
 * - View Students: See a list of all students in the system
 * - Add Student: Create a new student account
 * - Edit Students: Modify existing student accounts
 * - Delete Students: Remove student accounts from the system
 */
export default function ManageStudentsMenu() {
  useEffect(() => {
    document.title = "Manage Students Menu - Ivy League Associates";
  }, []);

  const menuItems = [
    {
      title: "View Students",
      description: "See all registered students",
      path: "/manage-students/all"
    },
    {
      title: "Intensive Students",
      description: "See all intensive students",
      path: "/manage-students/intensive"
    },
    {
      title: "Standard Students",
      description: "See all standard students",
      path: "/manage-students/standard"
    },
    {
      title: "Add Student", 
      description: "Create a new student account",
      path: "/manage-students/add"
    },
    {
      title: "Edit Students",
      description: "Modify existing student accounts", 
      path: "/manage-students/edit"
    },
    {
      title: "Delete Students",
      description: "Remove student accounts",
      path: "/manage-students/delete"
    }
  ]

  return (
    <div className={`flex flex-1 flex-col gap-3 h-full items-center justify-center overflow-y-scroll px-6 py-12 lg:px-8`}>
      <div className="absolute blur-sm flex items-center inset-0 z-0 h-full w-full">
        <img src={Logo} alt="Ivy League" className="opacity-70 mx-auto" />
      </div>

      <div className="flex items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm z-10">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <UsersRound className="size-4" />
        </div>
        <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text dark:drop-shadow-lg text-transparent animate-gradient-x truncate font-semibold">IVY LEAGUE ASSOCIATES</span>
      </div>
      
      <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text dark:drop-shadow-lg text-transparent animate-gradient-x my-2 z-10">What would you like to do today?</h1>

      <div className="flex flex-col max-[639px]:px-4 sm:grid gap-3 pt-3 max-h-[70vh] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full sm:justify-center items-center z-10 overflow-x-scroll">
        {menuItems.map((item, index) => (
          <div key={index} className={`w-full p-6 min-w-60 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}>
            <h3 className="text-xl font-bold mb-2">
              <Link 
                to={item.path}
                className="text-cyan-500 hover:text-cyan-600 no-underline"
              >
                {item.title}
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
            <Link 
              to={item.path}
              className="text-sm text-cyan-500 hover:text-cyan-600"
            >
              Learn more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
