
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  actionUrl?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader = ({ title, actionUrl, actionLabel, actionIcon = <Plus className="mr-2 h-4 w-4" />, children }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {children}
      </div>
      
      {actionUrl && actionLabel && (
        <div className="flex items-center space-x-2">
          <Link to={actionUrl}>
            <Button className="bg-pink-600 hover:bg-pink-700">
              {actionIcon}
              <span className="hidden sm:inline">{actionLabel}</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
