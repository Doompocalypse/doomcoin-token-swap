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
            <div className="grid gap-2 w-full">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <div className="flex items-start justify-between gap-4">
                  <ToastDescription className="flex-1 max-w-[90%]">{description}</ToastDescription>
                  {variant === "destructive" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-destructive-foreground/50 hover:text-destructive-foreground hover:bg-destructive-foreground/10"
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