import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  DollarSign,
  GraduationCap,
  Handshake,
  PencilLine,
  TrendingDown,
  TrendingUp,
  Users,
  Utensils,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminMetric } from "@/lib/admin-api";
import { fetchAdminMetrics } from "@/lib/admin-api";

interface MetricData {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
}

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
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Manage Students Menu - Ivy League Associates";
  }, []);

  useEffect(() => {
    let cancelled = false;

    const mapAdminMetricToUI = (metric: AdminMetric): MetricData | null => {
      const base: Omit<MetricData, "icon" | "iconColor"> = {
        id: metric.id,
        title: metric.title,
        value: metric.value.toLocaleString("en-US"),
        change: metric.change ?? "",
        changeType: metric.changeType ?? "positive",
      };

      switch (metric.id) {
        case "total_students":
          return {
            ...base,
            icon: Users,
            iconColor: "bg-gradient-to-br from-blue-500 to-blue-600",
          };
        case "active_courses":
          return {
            ...base,
            icon: BookOpen,
            iconColor: "bg-gradient-to-br from-green-500 to-green-600",
          };
        case "active_instructors":
          return {
            ...base,
            icon: GraduationCap,
            iconColor: "bg-gradient-to-br from-amber-500 to-amber-600",
          };
        case "monthly_revenue":
          return {
            ...base,
            icon: DollarSign,
            iconColor: "bg-gradient-to-br from-purple-500 to-purple-600",
          };
        default:
          return null;
      }
    };

    const loadMetrics = async () => {
      try {
        setIsLoadingMetrics(true);
        setMetricsError(null);
        const response = await fetchAdminMetrics();
        if (cancelled) return;

        const mapped = response
          .map(mapAdminMetricToUI)
          .filter((m): m is MetricData => m !== null);

        setMetrics(mapped);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load admin metrics", error);
        setMetricsError("Unable to load metrics right now.");
      } finally {
        if (!cancelled) {
          setIsLoadingMetrics(false);
        }
      }
    };

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  const menuItems = [
    {
      title: "View Students",
      description: "See all registered students",
      path: "/students",
      icon: Users,
      tag: "Students"
    },
    {
      title: "Edit Students details",
      description: "Modify existing student accounts", 
      path: "/students",
      icon: PencilLine,
      tag: "Students"
    },
    {
      title: "Create Scholarship",
      description: "Create Scholarship for students", 
      path: "/scholarship/create",
      icon: Award,
      tag: "Programs"
    },
    {
      title: "Create Sponsorship",
      description: "Create Sponsorship for students", 
      path: "/sponsorship/create",
      icon: Handshake,
      tag: "Programs"
    },
    {
      title: "Payments",
      description: "Manage payments",
      path: "/payments",
      icon: Wallet,
      tag: "Finance"
    },
    {
      title: "Diets",
      description: "Manage diets",
      path: "/diets",
      icon: Utensils,
      tag: "Programs"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome back</span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Student Operations</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Admin workspace
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/students">View Students</Link>
          </Button>
          <Button asChild>
            <Link to="/payments">Payments</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/admin">Admin Tools</Link>
          </Button>
        </div>
      </div>

      {metricsError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {metricsError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(isLoadingMetrics && metrics.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="border border-gray-100 dark:border-gray-800 animate-pulse"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
                  <div className="space-y-2">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                </CardContent>
              </Card>
            ))
          : metrics.map((metric) => (
              <MetricCard key={metric.id} data={metric} />
            )))}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <span className="text-sm text-muted-foreground">Jump into daily tasks</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.path}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-cyan-100 text-cyan-700 p-2">
                        <Icon className="size-4" />
                      </div>
                      <Badge variant="secondary">{item.tag}</Badge>
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-cyan-600">Open →</CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}

const MetricCard: React.FC<{ data: MetricData }> = ({ data }) => {
  const Icon = data.icon;
  const TrendIcon = data.changeType === 'positive' ? TrendingUp : TrendingDown;
  
  return (
    <Card className="border border-gray-100 dark:border-gray-800">
      <CardContent className="pt-6 space-y-4">
        <div className={`w-fit rounded-xl p-2 ${data.iconColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.value}</div>
          <div className="text-sm text-muted-foreground">{data.title}</div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${
          data.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendIcon className="h-3 w-3" />
          {data.change}
        </div>
      </CardContent>
    </Card>
  );
};