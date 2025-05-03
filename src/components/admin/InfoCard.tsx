
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick?: () => void;
}

const InfoCard = ({ icon, title, description, actionLabel, onClick }: InfoCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          {actionLabel}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default InfoCard;
