import Image from "next/image"
import type { AnyNotionBlock, NotionBlock } from "@/lib/notion/types"
import { RichTextRenderer } from "./richtext-renderer"

type NotionBlockRendererProps = {
  block: AnyNotionBlock
}

// type guard for NotionBlock
function isSupportedNotionBlock(block: AnyNotionBlock): block is NotionBlock {
  return (
    block.type === "paragraph" ||
    block.type === "heading_1" ||
    block.type === "heading_2" ||
    block.type === "heading_3" ||
    block.type === "bulleted_list_item" ||
    block.type === "numbered_list_item" ||
    block.type === "quote" ||
    block.type === "code" ||
    block.type === "image"
  )
}

export function NotionBlockRenderer({ block }: NotionBlockRendererProps) {
  if (!isSupportedNotionBlock(block)) {
    return null
  }

  const { type } = block

  switch (type) {
    case "paragraph":
      return (
        <p className="mb-4 leading-relaxed">
          <RichTextRenderer richText={block.paragraph.rich_text} />
        </p>
      )
    case "heading_1":
      return (
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          <RichTextRenderer richText={block.heading_1.rich_text} />
        </h1>
      )
    case "heading_2":
      return (
        <h2 className="text-xl md:text-3xl font-bold mb-4">
          <RichTextRenderer richText={block.heading_2.rich_text} />
        </h2>
      )
    case "heading_3":
      return (
        <h3 className="text-lg md:text-2xl font-bold mb-4">
          <RichTextRenderer richText={block.heading_3.rich_text} />
        </h3>
      )
    case "bulleted_list_item":
      return (
        <li className="mb-2 list-disc list-inside">
          <RichTextRenderer richText={block.bulleted_list_item.rich_text} />
        </li>
      )
    case "numbered_list_item":
      return (
        <li className="mb-2 list-decimal list-inside">
          <RichTextRenderer richText={block.numbered_list_item.rich_text} />
        </li>
      )
    case "quote":
      return (
        <blockquote className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground">
          <RichTextRenderer richText={block.quote.rich_text} />
        </blockquote>
      )
    case "code":
      return (
        <pre className="my-4 rounded bg-muted p-4">
          <code className="font-mono text-sm">
            {block.code.rich_text.map((rt) => rt.plain_text).join("")}
          </code>
        </pre>
      )
    case "image":
      const imageUrl =
        block.image.type === "external" ? block.image.external?.url : block.image.file?.url
      if (!imageUrl) {
        return null
      }
      const caption = block.image.caption?.map((rt) => rt.plain_text).join("") || ""
      return (
        <figure className="my-4">
          <Image
            src={imageUrl}
            alt="Notion Image"
            className="rounded-md"
            width={800}
            height={600}
          />
          {caption && (
            <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>
          )}
        </figure>
      )
    default:
      console.warn(`Unsupported Notion block type: ${type}`)
      return null
  }
}
