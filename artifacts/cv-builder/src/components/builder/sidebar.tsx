import { User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Trophy, Globe, LayoutTemplate, Sun, Moon, RotateCcw, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "wouter";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (s: string) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  resetCV: () => void;
}

export default function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed, darkMode, toggleDarkMode, resetCV }: SidebarProps) {
  const navItems = [
    { id: "personal", label: "Personal", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "languages", label: "Languages", icon: Globe },
    { id: "custom", label: "Custom", icon: LayoutTemplate },
  ];

  return (
    <div className={`h-full flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 shrink-0 no-print border-r border-slate-800 ${collapsed ? 'w-[70px]' : 'w-[220px]'}`}>
      <div className="h-14 flex items-center px-4 border-b border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <FileText className="w-6 h-6 text-blue-400" />
          {!collapsed && <span className="font-bold text-lg tracking-tight">ResumeAI</span>}
        </Link>
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto px-2">
        {navItems.map(item => (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                variant={activeSection === item.id ? "secondary" : "ghost"} 
                className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : 'px-3'} ${activeSection === item.id ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
                onClick={() => setActiveSection(item.id)}
                data-testid={`nav-${item.id}`}
              >
                <item.icon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
          </Tooltip>
        ))}
      </div>

      <div className="p-2 border-t border-slate-800 flex flex-col gap-1">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="ghost" className={`w-full justify-start text-slate-400 hover:text-slate-100 hover:bg-slate-800 ${collapsed ? 'px-0 justify-center' : 'px-3'}`} onClick={toggleDarkMode}>
              {darkMode ? <Sun className={`w-5 h-5 ${!collapsed && 'mr-3'}`} /> : <Moon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />}
              {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{darkMode ? "Light Mode" : "Dark Mode"}</TooltipContent>}
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="ghost" className={`w-full justify-start text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 ${collapsed ? 'px-0 justify-center' : 'px-3'}`} onClick={resetCV}>
              <RotateCcw className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
              {!collapsed && <span>Reset CV</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Reset CV</TooltipContent>}
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="ghost" className={`w-full justify-start text-slate-400 hover:text-slate-100 hover:bg-slate-800 ${collapsed ? 'px-0 justify-center' : 'px-3'}`} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5 mr-3" />}
              {!collapsed && <span>Collapse</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Expand</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );
}
