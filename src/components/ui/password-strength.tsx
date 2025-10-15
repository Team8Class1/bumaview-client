import { cn } from "@/lib/utils";
import { calculatePasswordStrength } from "@/lib/validation/auth";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const strengthLabels = ["매우 약함", "약함", "보통", "강함", "매우 강함"];
const strengthColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
];

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const { score, feedback } = calculatePasswordStrength(password);

  if (!password) {
    return null;
  }

  const strengthIndex = Math.min(Math.floor(score / 1.5), 4);
  const progressWidth = (score / 7) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {/* 강도 바 */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              strengthColors[strengthIndex],
            )}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">
          {strengthLabels[strengthIndex]}
        </span>
      </div>

      {/* 피드백 */}
      {feedback.length > 0 && (
        <div className="space-y-1">
          {feedback.map((item) => (
            <p key={item} className="text-xs text-gray-500 flex items-center">
              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
              {item}
            </p>
          ))}
        </div>
      )}

      {/* 강도별 메시지 */}
      {score >= 6 && (
        <p className="text-xs text-green-600 flex items-center">
          <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
          안전한 비밀번호입니다
        </p>
      )}
    </div>
  );
}
