interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
}

export default function QuestionCard({ id, title, content }: QuestionCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}