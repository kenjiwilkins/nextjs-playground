"use client"

import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { fetchNibblesRecipes } from "../nibbles/actions/fetchNibblesRecipes"

interface Recipe {
  id: string
  properties: {
    Name: {
      title: Array<{ plain_text?: string }>
    }
    tagName: {
      rollup: {
        array: Array<{
          title: Array<{ plain_text?: string }>
        }>
      }
    }
  }
}

type RecipesState = { items: Recipe[]; nextCursor: string | null }

interface RecipeCardListProps {
  recipes: Recipe[]
  nextCursor: string | null
}

export function RecipeCardList({ recipes, nextCursor }: RecipeCardListProps) {
  const initialState: RecipesState = { items: recipes, nextCursor }
  const [state, dispatch, isPending] = useActionState(
    async (prev: RecipesState, formData?: FormData) => {
      const cursorFromForm = formData?.get("cursor") as string | null | undefined
      const effectiveCursor = cursorFromForm ?? prev.nextCursor ?? undefined
      const data = await fetchNibblesRecipes(effectiveCursor)
      return {
        items: [...prev.items, ...data.results],
        nextCursor: data.next_cursor || null,
      } as RecipesState
    },
    initialState
  )

  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {state.items.map((recipe) => (
          <Link key={recipe.id} href={`/recipe/detail/${recipe.id}`}>
            <Card className="group">
              <CardHeader>
                <CardTitle>
                  {recipe.properties.Name.title[0]?.plain_text || "Untitled Recipe"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.properties.tagName.rollup.array.map((tag, index) => (
                    <Badge key={`${recipe.id}-badge-${index}`} variant="secondary">
                      {tag.title[0]?.plain_text || "Unnamed Tag"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </ul>
      {state.nextCursor && (
        <form action={dispatch} className="mt-6">
          <input type="hidden" name="cursor" value={state.nextCursor || ""} />
          <button
            className="w-full py-2 bg-muted rounded-lg disabled:opacity-50"
            disabled={isPending || !state.nextCursor}
            type="submit"
          >
            <span>{isPending ? "Loading..." : "Load More"}</span>
          </button>
        </form>
      )}
    </div>
  )
}
