import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchNibblesRecipes } from "./actions/fetchNibblesRecipes"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function RecipePage() {
  const recipes = await fetchNibblesRecipes()
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recipes Nibbles</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.results.map((recipe) => (
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
    </main>
  )
}
