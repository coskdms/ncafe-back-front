import MenuDetailClient from './_components/MenuDetailClient';

type Params = Promise<{ id: string }>;

export default async function MenuDetailPage({ params }: { params: Params }) {
    const { id } = await params;

    return <MenuDetailClient menuId={id} />;
}
