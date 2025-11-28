import { Metadata } from "next"
import { getRecipePageBlocks } from "@/lib/notion/recipes"
import { PageBodyRenderer } from "@/components/ui/notion/page-body-renderer"
import { AnyNotionBlock } from "@/lib/notion/types"
import { fetchRecipeMetadata } from "../../actions/fetchrecipes"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Force dynamic rendering to ensure metadata is generated per request
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ recipeId: string }>
}): Promise<Metadata> {
  const { recipeId } = await params
  const recipeMetadata = await fetchRecipeMetadata(recipeId)

  const title = `${recipeMetadata.name} | Kenji Wilkins`
  const description = `Recipe for ${recipeMetadata.name}. Tags: ${recipeMetadata.tags.join(", ")}`
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const url = `${baseUrl}/recipe/detail/${recipeId}`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Kenji Wilkins",
      locale: "en_US",
      type: "article",
      publishedTime: new Date().toISOString(),
      authors: ["Kenji Wilkins"],
      tags: recipeMetadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@kenjiwilkins",
    },
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ recipeId: string }>
}) {
  const { recipeId } = await params
  const recipeMetadata = await fetchRecipeMetadata(recipeId)

  let Blocks: AnyNotionBlock[] = []
  let error: string | null = null
  try {
    Blocks = await getRecipePageBlocks(recipeId)
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error occurred"
  }

  if (error) {
    return <div>Error loading recipe: {error}</div>
  }

  return (
    <div className="flex justify-center w-full">
      <div className="container">
        <div className="flex flex-col gap-4 p-4">
          {/* Recipe Info */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-4xl font-bold">{recipeMetadata.name}</h1>
            {recipeMetadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipeMetadata.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <Separator />
        <PageBodyRenderer className="py-4" blocks={Blocks} />
      </div>
    </div>
  )
}
