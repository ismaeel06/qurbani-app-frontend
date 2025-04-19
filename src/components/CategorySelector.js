import Link from "next/link"
import Image from "next/image"

const categories = [
  { id: "cow", name: "Cows", icon: "/images/cow.png" },
  { id: "goat", name: "Goats", icon: "/images/goat.png" },
  { id: "sheep", name: "Sheep", icon: "/images/sheep.png" },
  { id: "camel", name: "Camels", icon: "/images/camel.png" },
  { id: "buffalo", name: "Buffaloes", icon: "/images/buffalo.png" },
]

export default function CategorySelector() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/catalog?category=${category.id}`}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="w-16 h-16 mb-4 relative">
            <Image
              src={category.icon || "/placeholder.svg"}
              alt={category.name}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-medium text-gray-800">{category.name}</span>
        </Link>
      ))}
    </div>
  )
}
