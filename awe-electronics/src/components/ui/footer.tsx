import ThemeToggle from "@/components/ui/theme-toggle";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-background dark:border-border">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          {/* Theme toggle button ABOVE the text */}
          <div className="mb-4">
            <ThemeToggle />
          </div>

          <p className="text-sm font-semibold text-gray-800 dark:text-foreground">
            AWE-Electronics Shop System Prototype
          </p>
          <p className="text-sm text-gray-500 dark:text-muted-foreground">
            Showcasing RESTful, Facade, Strategy, Observer, and Repository patterns
          </p>
          <p className="text-sm text-gray-500 dark:text-muted-foreground">
            Copyright Swinsoft Consulting 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
