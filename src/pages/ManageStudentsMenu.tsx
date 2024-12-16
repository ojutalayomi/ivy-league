import { Link } from "react-router-dom"

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
  const menuItems = [
    {
      title: "View Students",
      description: "See all registered students",
      path: "/manage-students/view"
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
    <div className={`flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-cyan-500/20`}>

      <div className="prose dark:prose-invert max-w-none">
        {menuItems.map((item, index) => (
          <article key={index} className="mb-6">
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
          </article>
        ))}
      </div>
    </div>
  )
}
