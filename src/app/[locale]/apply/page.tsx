import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ApplyPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/login?intent=apply`);
}
