import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Settings, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface GoalConfig {
  name: string;
  targetDate: string;
  startDate: string;
}

interface GoalEditorProps {
  onGoalUpdate: (goal: GoalConfig) => void;
}

export default function GoalEditor({ onGoalUpdate }: GoalEditorProps) {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [resetData, setResetData] = useState(false);

  useEffect(() => {
    const savedGoal = localStorage.getItem('goalConfig');
    if (savedGoal) {
      const goal: GoalConfig = JSON.parse(savedGoal);
      setGoalName(goal.name);
      setTargetDate(new Date(goal.targetDate));
      setStartDate(new Date(goal.startDate));
    } else {
      setGoalName('CFA Level 1');
      setTargetDate(new Date('2026-06-30'));
      setStartDate(new Date());
    }
  }, [open]);

  const handleSave = () => {
    if (!goalName || !targetDate || !startDate) return;
    setShowAlert(true);
  };

  const confirmSave = () => {
    if (!goalName || !targetDate || !startDate) return;

    const goal: GoalConfig = {
      name: goalName,
      targetDate: targetDate.toISOString(),
      startDate: startDate.toISOString(),
    };

    localStorage.setItem('goalConfig', JSON.stringify(goal));

    if (resetData) {
      localStorage.removeItem('studySessions');
    }

    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('goalUpdated'));

    onGoalUpdate(goal);
    setShowAlert(false);
    setOpen(false);
    setResetData(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
            <span className="text-xs">Edit Goal</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-accent/30">
          <DialogHeader>
            <DialogTitle className="text-2xl">Goal Configuration</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Configure your mission parameters and timeline.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name" className="text-sm font-medium">
                Goal Name
              </Label>
              <Input
                id="goal-name"
                placeholder="e.g., CFA Level 1"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="bg-background/50 border-accent/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-background/50 border-accent/30"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover/95 backdrop-blur-sm border-accent/30" align="start">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-background/50 border-accent/30"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover/95 backdrop-blur-sm border-accent/30" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!goalName || !targetDate || !startDate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-sm border-accent/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Goal Update</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Updating the goal will reset the Reverse Life Clock. Historical study data will remain unless you choose to reset it.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reset-data"
                  checked={resetData}
                  onChange={(e) => setResetData(e.target.checked)}
                  className="w-4 h-4 rounded border-accent/30"
                />
                <label htmlFor="reset-data" className="text-sm text-foreground cursor-pointer">
                  Start fresh (reset all historical study data)
                </label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResetData(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>
              {resetData ? 'Reset & Save' : 'Keep Data & Save'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
