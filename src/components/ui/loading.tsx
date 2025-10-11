import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./card";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "데이터를 불러오는 중..." }: LoadingProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
