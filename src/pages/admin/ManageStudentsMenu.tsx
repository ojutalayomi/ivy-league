import { Link } from "react-router-dom"
import { useEffect } from "react";
import { BookOpen, Users, GraduationCap, DollarSign, TrendingUp, TrendingDown, Eye } from "lucide-react";

interface MetricData {
    id: string;
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconColor: string;
}

const metrics: MetricData[] = [
    {
      id: '1',
      title: 'Total Students',
      value: '1,247',
      change: '+12% from last month',
      changeType: 'positive',
      icon: Users,
      iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      id: '2',
      title: 'Active Courses',
      value: '42',
      change: '+3 new courses',
      changeType: 'positive',
      icon: BookOpen,
      iconColor: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      id: '3',
      title: 'Active Instructors',
      value: '28',
      change: '+2 this month',
      changeType: 'positive',
      icon: GraduationCap,
      iconColor: 'bg-gradient-to-br from-amber-500 to-amber-600'
    },
    {
      id: '4',
      title: 'Monthly Revenue',
      value: '$24.7K',
      change: '+18% from last month',
      changeType: 'positive',
      icon: DollarSign,
      iconColor: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
];

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
      path: "/students"
    },
    {
      title: "Add Student", 
      description: "Create a new student account",
      path: "/add"
    },
    {
      title: "Edit Students details",
      description: "Modify existing student accounts", 
      path: "/edit"
    },
    {
      title: "Create Scholarship",
      description: "Create Scholarship for students", 
      path: "/scholarship/create"
    },
    {
      title: "Create Sponsorship",
      description: "Create Sponsorship for students", 
      path: "/sponsorship/create"
    },
    {
      title: "Delete Students",
      description: "Remove student accounts",
      path: "/delete"
    },
    {
      title: "Payments",
      description: "Manage payments",
      path: "/payments"
    },
    {
      title: "Diets",
      description: "Manage diets",
      path: "/diets"
    }
  ]

  return (
    <div className={`h-full`}>

      {/* <div className="flex items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm z-10">
        <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-3xl drop-shadow-2xl text-transparent animate-gradient-x truncate font-semibold">IVY LEAGUE ASSOCIATES</span>
      </div> */}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Today, {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Welcome back, Admin
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Eye className="h-4 w-4" />
          View Reports
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} data={metric} />
        ))}
      </div>

      <div className="text-xl font-bold mb-2">Quick Links</div>
      <ul className="flex flex-col gap-2 py-2 w-full max-[639px]:px-4 list-none">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col">
            <h3 className="text-lg font-semibold mb-1">
              <Link 
                to={item.path}
                className="text-cyan-500 hover:text-cyan-600 no-underline"
              >
                {item.title}
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-1">{item.description}</p>
            <Link 
              to={item.path}
              className="text-sm text-cyan-500 hover:text-cyan-600"
            >
              Visit →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const MetricCard: React.FC<{ data: MetricData }> = ({ data }) => {
  const Icon = data.icon;
  const TrendIcon = data.changeType === 'positive' ? TrendingUp : TrendingDown;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${data.iconColor}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {data.value}
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {data.title}
      </div>
      
      <div className={`flex items-center gap-1 text-xs font-semibold ${
        data.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
      }`}>
        <TrendIcon className="h-3 w-3" />
        {data.change}
      </div>
    </div>
  );
};