import MenuDetailClient from './_components/MenuDetailClient';

type Params = Promise<{ id: number }>;

export default async function MenuDetailPage({ params }: { params: Params }) {
    return <MenuDetailClient params={params} />;
}
