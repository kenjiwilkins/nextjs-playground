import { fetchPreserveRecipes } from "./actions/fetchPreserveRecipes"
import { RecipeCardList } from "../components/recipe-card-list"

export default async function RecipePage() {
  const recipes = await fetchPreserveRecipes()
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recipes Preserve</h1>
      <RecipeCardList recipes={recipes.results} nextCursor={recipes.next_cursor || null} />
    </main>
  )
}
