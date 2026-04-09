type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return (
    <main>
      <h1>Blog Post: {slug}</h1>
    </main>
  );
}
