import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment"

export type ResponseType = "countdown" | "getlivetime" | "chat-time";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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