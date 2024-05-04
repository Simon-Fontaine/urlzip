import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const CustomH1 = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const className = "font-heading mt-2 scroll-m-20 text-4xl font-bold";

  if (id)
    return (
      <h1 id={id} className={className}>
        <Link href={`#${id}`}> {children}</Link>
      </h1>
    );

  return <h1 className={className}>{children}</h1>;
};

const CustomH2 = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const className =
    "font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0";

  if (id)
    return (
      <h2 id={id} className={className}>
        <Link href={`#${id}`}> {children}</Link>
      </h2>
    );

  return <h2 className={className}>{children}</h2>;
};

const CustomH3 = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const className =
    "font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight";

  if (id)
    return (
      <h3 id={id} className={className}>
        <Link href={`#${id}`}> {children}</Link>
      </h3>
    );

  return <h3 className={className}>{children}</h3>;
};

const CustomH4 = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const className =
    "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight";

  if (id)
    return (
      <h4 id={id} className={className}>
        <Link href={`#${id}`}> {children}</Link>
      </h4>
    );

  return <h4 className={className}>{children}</h4>;
};

const CustomH5 = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const className = "mt-8 scroll-m-20 text-lg font-semibold tracking-tight";

  if (id)
    return (
      <h5 id={id} className={className}>
        <Link href={`#${id}`}> {children}</Link>
      </h5>
    );

  return <h5 className={className}>{children}</h5>;
};

const CustomH6 = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const className = "mt-8 scroll-m-20 text-base font-semibold tracking-tight";

  if (id)
    return (
      <h6 id={id} className={className}>
        <Link href={`#${id}`}> {children}</Link>
      </h6>
    );

  return <h6 className={className}>{children}</h6>;
};

const CustomA = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <a href={href} className="font-medium underline underline-offset-4">
      {children}
    </a>
  );
};

const CustomP = ({ children }: { children: React.ReactNode }) => {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
};

const CustomUl = ({ children }: { children: React.ReactNode }) => {
  return <ul className="my-6 ml-6 list-disc">{children}</ul>;
};

const CustomOl = ({ children }: { children: React.ReactNode }) => {
  return <ol className="my-6 ml-6 list-decimal">{children}</ol>;
};

const CustomLi = ({ children }: { children: React.ReactNode }) => {
  return <li className="mt-2">{children}</li>;
};

const CustomBlockquote = ({ children }: { children: React.ReactNode }) => {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
};

const CustomImg = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} className="rounded-md" />;
};

const CustomHr = () => {
  return <hr className="my-4 md:my-8" />;
};

const CustomTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">{children}</table>
    </div>
  );
};

const CustomTr = ({ children }: { children: React.ReactNode }) => {
  return <tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>;
};

const CustomTh = ({ children }: { children: React.ReactNode }) => {
  return (
    <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </th>
  );
};

const CustomTd = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </td>
  );
};

const CustomCode = ({ children }: { children: React.ReactNode }) => {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
      {children}
    </code>
  );
};

const components = {
  h1: CustomH1,
  h2: CustomH2,
  h3: CustomH3,
  h4: CustomH4,
  h5: CustomH5,
  h6: CustomH6,
  a: CustomA,
  p: CustomP,
  ul: CustomUl,
  ol: CustomOl,
  li: CustomLi,
  blockquote: CustomBlockquote,
  img: CustomImg,
  hr: CustomHr,
  table: CustomTable,
  tr: CustomTr,
  th: CustomTh,
  td: CustomTd,
  code: CustomCode,
};

export function CustomMDX({ children }: { children: string }) {
  return (
    <MDXRemote
      source={children}
      components={components as any}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
    />
  );
}
