import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, X } from 'lucide-react';
import { useStudyData } from '../hooks/useQueries';

export default function NotificationManager() {
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { getTodayHours } = useStudyData();

  useEffect(() => {
    const checkPermission = () => {
      if ('Notification' in window) {
        const permission = Notification.permission;
        
        if (permission === 'granted') {
          setPermissionGranted(true);
          localStorage.setItem('notificationPermission', 'granted');
        } else if (permission === 'default') {
          const hasAsked = localStorage.getItem('notificationAsked');
          if (!hasAsked) {
            setTimeout(() => setShowPermissionPrompt(true), 5000);
          }
        }
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const sendReminder = () => {
      const now = new Date();
      const hour = now.getHours();
      const todayHours = getTodayHours();
      
      const lastNotification = localStorage.getItem('lastNotificationTime');
      const lastNotificationTime = lastNotification ? parseInt(lastNotification) : 0;
      const timeSinceLastNotification = Date.now() - lastNotificationTime;
      
      if (timeSinceLastNotification < 3600000) return;
      
      if (hour >= 9 && hour < 21 && todayHours === 0) {
        new Notification('Execution Mode', {
          body: 'Time is running. Start your deep work.',
          icon: '/assets/generated/timer-icon-transparent.dim_64x64.png',
          badge: '/assets/generated/timer-icon-transparent.dim_64x64.png',
          tag: 'deep-work-reminder',
        });
        localStorage.setItem('lastNotificationTime', Date.now().toString());
      }
    };

    const interval = setInterval(sendReminder, 1800000);
    sendReminder();

    return () => clearInterval(interval);
  }, [permissionGranted, getTodayHours]);

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      localStorage.setItem('notificationAsked', 'true');
      
      if (permission === 'granted') {
        setPermissionGranted(true);
        localStorage.setItem('notificationPermission', 'granted');
        setShowPermissionPrompt(false);
        
        new Notification('Execution Mode', {
          body: 'Notifications enabled. Stay focused.',
          icon: '/assets/generated/timer-icon-transparent.dim_64x64.png',
        });
      } else {
        setShowPermissionPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationAsked', 'true');
    setShowPermissionPrompt(false);
  };

  if (!showPermissionPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className="p-6 bg-card border-accent/30 shadow-2xl">
        <div className="flex items-start gap-4">
          <Bell className="w-6 h-6 text-chart-1 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              Stay on Track
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enable notifications to receive gentle reminders when you haven't started your deep work.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={handleRequestPermission}
                size="sm"
                className="bg-chart-1 hover:bg-chart-1/80"
              >
                Enable
              </Button>
              <Button 
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
              >
                Not Now
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
