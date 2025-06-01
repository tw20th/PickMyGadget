"use client";

import { FaTwitter } from "react-icons/fa";

type Props = {
  url: string;
  title: string;
};

export const TwitterShareButton = ({ url, title }: Props) => {
  const shareUrl = `https://twitter.com/share?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 text-blue-500 text-sm hover:underline"
    >
      <FaTwitter />
      シェアする
    </a>
  );
};
