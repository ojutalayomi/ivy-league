import { Monitor, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/providers/theme-provider"
import { cn } from "@/lib/utils"

export function ModeToggle({ className, label = true,  align = "end"}: { className?: string, label?: boolean, align?: "start" | "end" }) {
  // The `label` prop is used to conditionally render the text for light and dark modes.
  // If you want to use the label prop, you can conditionally render the text based on it.
  // For example, you can use it to show or hide the text based on the theme.
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("flex items-center gap-1 h-7 p-2 w-auto", className)} variant="outline" size="icon">
          <Sun className="dark:hidden size-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {label && (<span className="dark:hidden">Light Mode</span>)}
          <Moon className="hidden dark:block size-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {label && (
            <>
              <span className="hidden dark:block">Dark Mode</span>
              <span className="sr-only">Toggle theme</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun/>Light Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon/>Dark Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor/>System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
