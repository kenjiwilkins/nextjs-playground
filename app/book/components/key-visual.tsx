import Image from "next/image"

export default function KeyVisual() {
  return (
    <div className="relative w-full">
      {/* Horizontal image for PC/Desktop */}
      <div className="hidden md:block relative w-full h-[20vh]">
        <Image
          src="/bookshelg-bg.png"
          alt="Bookshelf background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Square image for mobile/tablet */}
      <div className="block md:hidden relative w-full h-[20vh]">
        <Image
          src="/bookshelg-bg.png"
          alt="Bookshelf background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </div>
  )
}
