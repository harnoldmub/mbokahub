type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-muted-foreground text-sm uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-muted-foreground text-lg leading-8">
        {description}
      </p>
    </section>
  );
}
