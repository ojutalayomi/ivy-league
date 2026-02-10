import Logo from "@/assets/ivyLight.png";
import LogoDark from "@/assets/ivyDark.png";
import LogoMobile from "@/assets/logo_white.png";
import LogoDarkMobile from "@/assets/logo_black.png";
import { LoaderCircle } from "lucide-react";

export default function AccountsLayout({ children }: { children?: React.ReactNode }) {
  
  return (
    <div className={`flex min-h-full flex-1 gap-2 items-center justify-center sm:p-6`}>
      <div className="relative hidden sm:flex flex-col p-8 aspect-square shadow-lg rounded-lg bg-cyan-500 items-center justify-center gap-2 w-1/2">
        <img src={Logo} alt="Ivy League" className="hidden w-80 h-80 mx-auto" /> {/** I intentionally hid the light logo on the desktop */}
        <img src={LogoDark} alt="Ivy League" className="h-80 mx-auto" />
        <div className="absolute bottom-0 mb-4 text-xs text-white">© {new Date().getFullYear()} Ivy League Associates.</div>
      </div>
      <div className="w-1/2 relative flex-1 sm:flex-auto gap-4 flex flex-col items-center justify-center h-[100vh] sm:h-[calc(100vh-48px)] rounded-lg">
        <div className="w-full rounded-b-lg p-10 bg-cyan-500 sm:hidden flex flex-col items-center justify-center gap-2">
          <img src={LogoMobile} alt="Ivy League" className="mx-auto mb-2" />
          <img src={LogoDarkMobile} alt="Ivy League" className="hidden mx-auto mb-2" />
        </div>
        {children ? 
          <div className="w-full h-full flex flex-col items-center sm:justify-center gap-2 px-4">
              {/*<h1 className="text-3xl">{Mode === 'student' ? 'Student Page' : 'Staff Page'}</h1>*/}
              {children}
          </div> :
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <LoaderCircle className="animate-spin" /> 
            <div className="text-center text-muted-foreground">Please wait while we load the page... <br /> This may take a few seconds.</div>
          </div>
        }
          <div className="absolute bottom-0 mb-4 text-xs sm:hidden">© {new Date().getFullYear()} Ivy League Associates.</div>
        </div>
    </div>
  )
}