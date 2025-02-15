"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type R2Image = {
  key: string;
  uploaded: string;
};

const imageLoader = ({ src }: { src: string }) => {
  return `/cdn-cgi/image/width=360,quality=75/api/image?key=${src}`;
};

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

const cloudflareLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (process.env.NODE_ENV === "development") {
    return src;
  }
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");
  return `/cdn-cgi/image/${paramsString}/api/image?key=${normalizeSrc(src)}`;
};

export default function Images() {
  const [images, setImages] = useState<R2Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const currentUrl = new URL(window.location.href);
      const data = await fetch(`${currentUrl.origin}/api/images`);
      const imageData = await data.json<R2Image[]>();
      setImages(imageData);
      console.log(imageData);
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen block md:flex">
      <div className="w-full block md:flex flex-col md:h-screen">
        <div className="p-4 bg-white space-y-2">
          <h1 className="text-2xl font-bold">List Images</h1>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {!images || (!images.length && <span>No images yet.</span>)}

          <div className="grid grid-cols-4 gap-2 max-w-screen-xl">
            {images.map((image) => (
              <div className="space-y-2" key={image.key}>
                <Image
                  loader={cloudflareLoader}
                  src={image.key}
                  width={360}
                  height={360}
                  alt={image.key}
                  quality={75}
                />
                <p className="text-sm truncate">{image.key}</p>
              </div>
            ))}
          </div>

          <p>
            <Button asChild>
              <Link href="/">Back to Image Generator</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
