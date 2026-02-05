import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2025. Built with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-chart-1 hover:text-chart-1/80 transition-colors font-medium"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
