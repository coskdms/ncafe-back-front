import MenuDetailClient from './_components/MenuDetailClient';

type Params = Promise<{ id: string }>;

export default async function MenuDetailPage({ params }: { params: Params }) {
    return <MenuDetailClient params={params} />;
}
