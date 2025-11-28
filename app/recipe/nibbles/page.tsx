import { fetchNibblesRecipes } from "./actions/fetchNibblesRecipes"
import { RecipeCardList } from "../components/recipe-card-list"

export default async function RecipePage() {
  const recipes = await fetchNibblesRecipes()
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recipes Nibbles</h1>
      <RecipeCardList recipes={recipes.results} nextCursor={recipes.next_cursor || null} />
    </main>
  )
}
