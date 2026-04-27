import { redirect } from "next/navigation";

type ProDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BeauteDetailsPage({
  params,
}: ProDetailsPageProps) {
  const { id } = await params;
  redirect(`/pro/${id}`);
}
