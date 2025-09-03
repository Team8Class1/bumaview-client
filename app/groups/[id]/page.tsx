export default function GroupDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Group Detail: {params.id}</h1>
    </div>
  );
}