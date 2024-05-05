"use client";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const RevealBento = () => {
  return (
    <div className="min-h-screen px-4 py-12">
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4"
      >
        <HeaderBlock />
        <SocialsBlock />
        <AboutBlock />
        <LocationBlock />
        <EmailListBlock />
      </motion.div>
    </div>
  );
};

type BlockProps = {
  className?: string;
} & MotionProps;

const Block = ({ className, ...rest }: BlockProps) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={cn(
        "col-span-4 rounded-lg border border-slate-200 bg-white p-6 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        className,
      )}
      {...rest}
    />
  );
};

const HeaderBlock = () => (
  <Block className="col-span-12 row-span-2 md:col-span-6">
    <Image
      src="https://cdn.discordapp.com/avatars/517770661733859329/0de095deb7b84d1a48a4520a2861cc41.png"
      alt="avatar"
      width={56}
      height={56}
      priority={true}
      className="mb-4 rounded-full"
    />
    <h1 className="mb-12 text-4xl font-medium leading-tight">
      Hi, I'm Hestia.{" "}
      <span className="text-zinc-400">
        Creator and founder of {config.name}
      </span>
    </h1>
    <a
      href="mailto:contact@urlzip.xyz"
      className="group flex items-center gap-1 text-red-500 hover:underline dark:text-red-600"
    >
      Contact me{" "}
      <ArrowRight className="group h-5 w-5 transition-transform group-hover:translate-x-1" />
    </a>
  </Block>
);

const SocialsBlock = () => (
  <>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-red-500 dark:bg-red-600 md:col-span-3"
    >
      <Link
        href={config.links.discord}
        target="_blank"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <Icons.discord className="h-10 w-10" />
      </Link>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-green-600 dark:bg-green-700 md:col-span-3"
    >
      <Link
        href={config.links.github}
        target="_blank"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <Icons.github className="h-10 w-10" />
      </Link>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-yellow-500 dark:bg-yellow-600 md:col-span-3 "
    >
      <Link
        href={config.links.github}
        target="_blank"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <Icons.paypal className="h-10 w-10" />
      </Link>
    </Block>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-blue-500 dark:bg-blue-600 md:col-span-3"
    >
      <Link
        href={config.links.twitter}
        target="_blank"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <Icons.twitter className="h-10 w-10" />
      </Link>
    </Block>
  </>
);

const AboutBlock = () => (
  <Block className="col-span-12 text-3xl leading-snug">
    <p>
      Lorem ipsum dolor sit amet.{" "}
      <span className="text-zinc-400">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Sit amet cursus sit
        amet dictum sit. Fermentum odio eu feugiat pretium nibh ipsum.
      </span>
    </p>
  </Block>
);

const LocationBlock = () => (
  <Block className="col-span-12 flex flex-col items-center gap-4 md:col-span-3">
    <MapPin className="text-3xl" />
    <p className="text-center text-lg text-zinc-400">Brussels, Belgium</p>
  </Block>
);

const EmailListBlock = () => (
  <Block className="col-span-12 md:col-span-9">
    <p className="mb-3 text-lg">Join my mailing list</p>
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);

        toast({
          title: "You submitted the following value:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(Object.fromEntries(formData), null, 2)}
              </code>
            </pre>
          ),
        });
      }}
      className="flex items-center gap-2"
    >
      <Input
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
      />
      <Button type="submit">
        <Mail className="mr-2 h-5 w-5" /> Join the list
      </Button>
    </form>
  </Block>
);
