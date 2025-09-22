import { toast } from 'sonner';

interface PopupOptions {
  url: string;
  width?: number;
  height?: number;
  name?: string;
}

interface PopupMessage {
  type: string;
  token?: string;
  index?: number;
  [key: string]: unknown;
}

export const openPopup = ({ url, width = 600, height = 600, name = 'payment' }: PopupOptions): Window | null => {
  // Calculate center position
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  try {
    const popup = window.open(
      url,
      name,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );

    if (!popup) {
      toast.error("Popup Blocked",{
        description: "Please allow popups for this website to proceed with payment.",
      });
      return null;
    }

    return popup;
  } catch (err) {
    console.error('Failed to open popup:', err);
    toast.error("Error",{
      description: "Failed to open payment window. Please try again.",
    });
    return null;
  }
};

export const handlePopupMessage = (
  event: MessageEvent,
  expectedOrigin: string,
  callback: (data: PopupMessage) => void
) => {
  // Verify the message is from the expected origin
  if (event.origin !== expectedOrigin) return;

  try {
    callback(event.data as PopupMessage);
  } catch (err) {
    console.error('Error handling popup message:', err);
    toast.error("Error",{
      description: "Failed to process payment response. Please try again.",
    });
  }
}; 