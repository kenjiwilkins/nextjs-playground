import type { AnyNotionBlock } from "@/lib/notion/types"
import { NotionBlockRenderer } from "./block-renderer"
import { cn } from "@/lib/utils"

type PageBodyRendererProps = {
  blocks: AnyNotionBlock[]
  className?: string
}

export function PageBodyRenderer({ blocks, className }: PageBodyRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  // group list items
  const groupBlocks = (blocks: AnyNotionBlock[]) => {
    const grouped: Array<AnyNotionBlock | AnyNotionBlock[]> = []
    let currentList: AnyNotionBlock[] = []
    let currentListType: "bulleted_list_item" | "numbered_list_item" | null = null

    blocks.forEach((block) => {
      if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
        if (currentListType === block.type) {
          // same list type, continue grouping
          currentList.push(block)
        } else {
          // different list type, push current list and start new
          if (currentList.length > 0) {
            grouped.push([...currentList])
          }
          currentList = [block]
          currentListType = block.type
        }
      } else {
        // blocks other than list items
        if (currentList.length > 0) {
          grouped.push([...currentList])
          currentList = []
          currentListType = null
        }
        grouped.push(block)
      }
    })

    // push any remaining list items
    if (currentList.length > 0) {
      grouped.push([...currentList])
    }

    return grouped
  }

  const groupedBlocks = groupBlocks(blocks)

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {groupedBlocks.map((blockOrGroup, index) => {
        if (Array.isArray(blockOrGroup)) {
          // it's a group of list items
          const listType = blockOrGroup[0].type
          const ListTag = listType === "bulleted_list_item" ? "ul" : "ol"
          const listClassName = listType === "bulleted_list_item" ? "list-disc" : "list-decimal"
          return (
            <ListTag key={`list-${index}`} className={`mb-4 pl-6 ${listClassName}`}>
              {blockOrGroup.map((listItem) => (
                <NotionBlockRenderer key={listItem.id} block={listItem} />
              ))}
            </ListTag>
          )
        } else {
          // it's a single block
          return <NotionBlockRenderer key={blockOrGroup.id} block={blockOrGroup} />
        }
      })}
    </div>
  )
}
