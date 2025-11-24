"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  hoverGradient: string
}

const categories: Category[] = [
  {
    id: "general",
    title: "全レシピ",
    description: "すべてのレシピ、膨大なので注意",
    icon: "🍳",
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "from-blue-600 to-cyan-600",
  },
  {
    id: "nibbles",
    title: "おつまみ",
    description: "おつまみ、基本的には保存に効くものが多い",
    icon: "🥨",
    gradient: "from-purple-500 to-pink-500",
    hoverGradient: "from-purple-600 to-pink-600",
  },
  {
    id: "preserves",
    title: "保存食",
    description: "保存食、主に長期冷凍できるものが多い",
    icon: "🫙",
    gradient: "from-amber-500 to-orange-500",
    hoverGradient: "from-amber-600 to-orange-600",
  },
]

export function CategoryCards() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Recipe Collections</h1>
        <p className="text-lg">Choose a category to explore our curated recipes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const isHovered = hoveredId === category.id

          return (
            <Link
              key={category.id}
              href={`/recipe/${category.id}`}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group"
            >
              <Card
                className={`
                  relative overflow-hidden border-0 shadow-lg
                  transition-all duration-300 ease-out
                  ${isHovered ? "scale-105 shadow-2xl" : "scale-100"}
                `}
              >
                {/* Gradient Background */}
                <div
                  className={`
                    absolute inset-0 bg-linear-to-br
                    ${isHovered ? category.hoverGradient : category.gradient}
                    transition-all duration-300
                  `}
                />

                {/* Shine Effect */}
                <div
                  className={`
                    absolute inset-0 bg-linear-to-tr from-transparent via-white to-transparent
                    opacity-0 group-hover:opacity-20
                    transition-opacity duration-300
                  `}
                />

                {/* Content */}
                <CardHeader className="relative text-center pb-2">
                  {/* Icon */}
                  <div
                    className={`
                      text-7xl mb-4
                      transition-transform duration-300
                      ${isHovered ? "scale-110 rotate-6" : "scale-100 rotate-0"}
                    `}
                  >
                    {category.icon}
                  </div>
                  <CardTitle className="text-2xl text-white">{category.title}</CardTitle>
                </CardHeader>

                <CardContent className="relative text-center pb-8">
                  <CardDescription className="text-white/90 text-sm leading-relaxed mb-6">
                    {category.description}
                  </CardDescription>

                  {/* Arrow Indicator */}
                  <div
                    className={`
                      flex items-center justify-center gap-2 text-white font-semibold
                      transition-transform duration-300
                      ${isHovered ? "translate-x-2" : "translate-x-0"}
                    `}
                  >
                    <span>Explore</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
