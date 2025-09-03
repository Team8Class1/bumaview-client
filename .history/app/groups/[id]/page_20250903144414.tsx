export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div>
      <h1>Group Detail: {id}</h1>
    </div>
  );
}