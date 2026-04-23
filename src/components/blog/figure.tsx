type Props = {
  src: string;
  alt: string;
  caption?: string;
};

export function Figure({ src, alt, caption }: Props) {
  return (
    <figure className="my-10">
      <img
        src={src}
        alt={alt}
        className="rounded-lg border border-[#1F2937] w-full h-auto"
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-xs font-mono text-[#6B7280] mt-3 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
