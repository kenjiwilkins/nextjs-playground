import type { RichText } from "@/lib/notion/types"
import Link from "next/link"

type RichTextRendererProps = {
  richText: RichText[]
}

export function RichTextRenderer({ richText }: RichTextRendererProps) {
  if (!richText || richText.length === 0) {
    return null
  }
  return (
    <>
      {richText.map((textItem, index) => {
        const { annotations, text, plain_text } = textItem
        let element = <span key={index}>{plain_text}</span>
        if (text.link) {
          element = (
            <Link
              key={`link-${index}`}
              href={text.link.url || "#"}
              className="underline hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {plain_text}
            </Link>
          )
        }
        if (annotations.bold) {
          element = <strong key={index}>{element}</strong>
        }
        if (annotations.italic) {
          element = <em key={index}>{element}</em>
        }
        if (annotations.strikethrough) {
          element = <s key={index}>{element}</s>
        }
        if (annotations.underline) {
          element = <u key={index}>{element}</u>
        }
        if (annotations.code) {
          element = (
            <code key={index} className="rounded bg-muted px-1 font-mono text-sm">
              {element}
            </code>
          )
        }
        return element
      })}
    </>
  )
}
