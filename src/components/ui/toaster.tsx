import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { ClipboardCopy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Toaster() {
  const { toasts } = useToast()

  const handleCopy = (title: string, description: string) => {
    const textToCopy = `Error: ${title}\nDetails: ${description}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Error message copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy error message:', err);
    });
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex flex-col space-y-2">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <div className="flex items-start justify-between gap-2">
                  <ToastDescription className="text-sm whitespace-pre-wrap break-words mr-8">
                    {description}
                  </ToastDescription>
                  {variant === "destructive" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive-foreground/90 hover:text-destructive-foreground hover:bg-destructive-foreground/10"
                      onClick={() => handleCopy(title || '', description?.toString() || '')}
                    >
                      <ClipboardCopy className="h-5 w-5" />
                      <span className="sr-only">Copy error message</span>
                    </Button>
                  )}
                </div>
              )}
              {action}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}