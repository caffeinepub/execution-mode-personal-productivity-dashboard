import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useStudyData } from '../hooks/useQueries';

export default function FailureAlert() {
  const { getTodayHours, checkMissedDay } = useStudyData();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      const hour = now.getHours();
      const todayHours = getTodayHours();
      const missedYesterday = checkMissedDay();

      if (hour >= 21 && todayHours === 0) {
        setAlertMessage('⚠️ 9PM Alert: 0 hours logged today. Time is running out.');
        setShowAlert(true);
      } else if (hour < 12 && missedYesterday) {
        setAlertMessage('⚠️ Morning Alert: You missed yesterday. Don\'t let it happen again.');
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 60000);
    return () => clearInterval(interval);
  }, [getTodayHours, checkMissedDay]);

  if (!showAlert) return null;

  return (
    <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
      <AlertTriangle className="h-5 w-5" />
      <AlertDescription className="text-base font-semibold">
        {alertMessage}
      </AlertDescription>
    </Alert>
  );
}
