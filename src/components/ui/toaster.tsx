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
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <div className="flex items-center justify-between gap-2">
                  <ToastDescription>{description}</ToastDescription>
                  {variant === "destructive" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() => handleCopy(title || '', description?.toString() || '')}
                    >
                      <ClipboardCopy className="h-4 w-4" />
                      <span className="sr-only">Copy error message</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}