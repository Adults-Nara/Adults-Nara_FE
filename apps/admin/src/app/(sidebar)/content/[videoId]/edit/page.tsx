import { EditContentContainer } from '@/components/content';

interface EditContentPageProps {
  params: Promise<{ videoId: string }>;
}

const EditContentPage = async ({ params }: EditContentPageProps) => {
  const { videoId } = await params;
  return <EditContentContainer videoId={videoId} />;
};

export default EditContentPage;
