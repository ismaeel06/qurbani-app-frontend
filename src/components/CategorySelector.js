import Link from "next/link"
import Image from "next/image"
import { useTranslation } from 'react-i18next'

export default function CategorySelector() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ur';
  
  const categories = [
    { id: "cow", name: t('category_selection.cow'), icon: "/images/cow.png" },
    { id: "goat", name: t('category_selection.goat'), icon: "/images/goat.png" },
    { id: "sheep", name: t('category_selection.sheep'), icon: "/images/sheep.png" },
    { id: "camel", name: t('category_selection.camel'), icon: "/images/camel.png" },
    { id: "buffalo", name: t('category_selection.buffalo'), icon: "/images/buffalo.png" },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/catalog?category=${category.id}`}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          dir={isRTL ? "rtl" : "ltr"}
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
          <span className={`text-lg font-medium text-gray-800 ${isRTL ? 'text-right' : ''}`}>{category.name}</span>
        </Link>
      ))}
    </div>
  )
}
