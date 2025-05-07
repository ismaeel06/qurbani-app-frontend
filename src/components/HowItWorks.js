import { useTranslation } from "react-i18next";

export default function HowItWorks() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ur';
    
    const steps = [
      {
        title: "Browse Listings",
        description: "Search through our extensive catalog of cattle from trusted sellers across the country.",
        icon: "🔍",
        key: "browse"
      },
      {
        title: "Contact Seller",
        description: "Use our secure chat system to discuss details and negotiate with the seller directly.",
        icon: "💬",
        key: "contact"
      },
      {
        title: "Inspect & Purchase",
        description: "Arrange to inspect the animal in person before finalizing your purchase.",
        icon: "🤝",
        key: "inspect"
      },
      {
        title: "Arrange Delivery",
        description: "Coordinate with the seller for pickup or delivery of your animal for Qurbani.",
        icon: "🚚",
        key: "delivery"
      },
    ]
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
            {t('home.how_it_works')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col items-center text-center ${isRTL ? 'items-center' : ''}`}>
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full text-2xl mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? t(`how_it_works.${step.key}.title`) || step.title : step.title}
                </h3>
                <p className="text-gray-600" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? t(`how_it_works.${step.key}.description`) || step.description : step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
