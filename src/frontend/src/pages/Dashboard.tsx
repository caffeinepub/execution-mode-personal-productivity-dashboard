import { useEffect, useState } from 'react';
import ReverseLifeClock from '../components/ReverseLifeClock';
import ForwardLifeClock from '../components/ForwardLifeClock';
import DailyQuote from '../components/DailyQuote';
import ChronographTimer from '../components/ChronographTimer';
import DaysRemaining from '../components/DaysRemaining';
import ExecutionScore from '../components/ExecutionScore';
import TimeBasedMessage from '../components/TimeBasedMessage';
import Footer from '../components/Footer';
import NotificationManager from '../components/NotificationManager';
import PsychologicalTriggerBar from '../components/PsychologicalTriggerBar';
import ThemeModeDialog from '../components/ThemeModeDialog';
import { useStudyData } from '../hooks/useQueries';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const { getTodayHours } = useStudyData();
  const todayHours = getTodayHours();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div 
        className="fixed inset-0 opacity-[0.008] pointer-events-none dark:block hidden"
        style={{
          backgroundImage: 'url(/assets/generated/background-pattern.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10">
        <PsychologicalTriggerBar />
        
        <header className="border-b border-border/40 backdrop-blur-sm shadow-lg shadow-black/20 dark:shadow-black/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                EXECUTION MODE
              </h1>
              <TimeBasedMessage currentTime={currentTime} />
            </div>
            <button
              onClick={() => setThemeDialogOpen(true)}
              className="absolute top-6 right-4 p-2 opacity-40 hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label="Theme settings"
            >
              <img 
                src="/assets/generated/gear-icon-transparent.dim_24x24.png" 
                alt="" 
                className="w-5 h-5"
              />
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="hero-section">
              <ReverseLifeClock />
            </div>
            <div className="supporting-section">
              <ForwardLifeClock />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 supporting-cards">
            <div className="lg:col-span-2">
              <DailyQuote />
            </div>
            <div className="space-y-6">
              <DaysRemaining />
              <ExecutionScore hours={todayHours} />
            </div>
          </div>

          <ChronographTimer />
        </main>

        <Footer />
        <NotificationManager />
        <ThemeModeDialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen} />
      </div>
    </div>
  );
}
