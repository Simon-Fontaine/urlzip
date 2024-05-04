import fs from "fs";
import matter from "gray-matter";
import path from "path";

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function getMDXData(dir: string) {
  const files = getMDXFiles(dir);

  return files.map((file) => {
    const filePath = path.join(dir, file);
    const { content, data } = matter.read(filePath);

    return {
      slug: file.replace(".mdx", ""),
      content: content,
      data: data,
    };
  });
}

export function getPages() {
  return getMDXData(path.join(process.cwd(), "content"));
}
