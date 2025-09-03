export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Question Detail: {params.id}</h1>
    </div>
  );
}