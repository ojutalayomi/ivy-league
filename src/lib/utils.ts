import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment"
import { Dispatch } from "@reduxjs/toolkit";
import { Location, NavigateFunction } from "react-router-dom";
import { clearUser, UserState } from "@/redux/userSlice";
import { toast } from "sonner";
import { ModeEnum } from "@/providers/user-provider";

export type ResponseType = "countdown" | "getlivetime" | "chat-time";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function ResetUser(dispatch: Dispatch, navigate: NavigateFunction, location?: Location, path?: string, whiteList?: string[]) {
  localStorage.removeItem('ivy_user_token');
  dispatch(clearUser());
  if (!whiteList || !whiteList.includes(location?.pathname ?? '')) {
    navigate('/accounts/signin' + (path ? `?redirect=${path}` : ''));
  }
}

export function CheckForIncorrectPermission(data: UserState, t: typeof toast, Mode: ModeEnum | null, dispatch: Dispatch, navigate: NavigateFunction, location?: Location, path?: string, whiteList?: string[]){
    if (data.user_status === 'student' && Mode === ModeEnum.staff) {
        t.error("This is the staff portal.", {
            description: "Please use the student portal to sign in."
        })
        ResetUser(dispatch, navigate, location, path, whiteList);
        return 1;
    } else if (data.user_status === 'staff' && Mode === ModeEnum.student) {
        t.error("This is the student portal.", {
            description: "Please use the staff portal to sign in."
        })
        ResetUser(dispatch, navigate, location, path, whiteList);
        return 1;
    }
    return 0;
}

export class Time {
	time: string;
	
	constructor(time?: string) {
		this.time = time || '';
    }

    static formatNo(no: number) {
        if (no >= 1000000) {
            return (no / 1000000).toFixed(1) + 'M';
        } else if (no >= 1000) {
            return (no / 1000).toFixed(1) + 'K';
        } else {
            return no.toString();
        }
    }

    format(time?: string) {
        const dateObj = new Date((time ? time : this.time));
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };
        return dateObj.toLocaleString('en-US', options);
    }

    formatMoment(time?: string) {
        const date = moment((time ? this.format(time) : this.format(this.time)), 'MM/DD/YYYY, h:mm:ss A');
        return date.format('MMM D, YYYY h:mm:ss A');
    }

	updateLiveTime(response: ResponseType, responseTime?: string): string {
		const availableTime = responseTime ? responseTime : this.time

		const time = new Date(availableTime).getTime();
		const now = new Date().getTime();

        if (response === "chat-time") {
            const timeObj = new Date(this.time);
            return timeObj.toLocaleString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            });
        }

        const distance = response === "countdown" ? time - now : now - time;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
            const date = this.format(availableTime ? availableTime : this.time);
            return date;
        } else if (hours > 0) {
            return `${hours}${hours === 1 ? " hr" : " hrs"}`;
        } else if (minutes > 0) {
            return `${minutes}${minutes === 1 ? " min" : " mins"}`;
        } else {
            return `${seconds}${seconds === 1 ? " sec" : " secs"}`;
        }
    }
}