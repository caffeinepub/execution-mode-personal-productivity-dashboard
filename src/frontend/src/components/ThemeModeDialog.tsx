import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ThemeModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ThemeModeDialog({ open, onOpenChange }: ThemeModeDialogProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Theme</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-3 py-3">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="cursor-pointer font-normal text-base">
                Light
              </Label>
            </div>
            <div className="flex items-center space-x-3 py-3">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="cursor-pointer font-normal text-base">
                Dark
              </Label>
            </div>
            <div className="flex items-center space-x-3 py-3">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="cursor-pointer font-normal text-base">
                System Default
              </Label>
            </div>
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
