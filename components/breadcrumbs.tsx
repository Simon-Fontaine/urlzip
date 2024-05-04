"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  function capitalize(string: string) {
    const words = string.split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
  }

  const items = [];

  for (let i = 0; i < pathnames.length; i++) {
    const href = `/${pathnames.slice(0, i + 1).join("/")}`;
    const title = capitalize(pathnames[i]);

    if (i === pathnames.length - 1) {
      items.push(
        <BreadcrumbItem key={href}>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>,
      );

      break;
    }

    items.push(
      <BreadcrumbItem key={href}>
        <BreadcrumbLink asChild>
          <Link href={href}>{title}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>,
    );
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            {item}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
