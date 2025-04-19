export default function HowItWorks() {
    const steps = [
      {
        title: "Browse Listings",
        description: "Search through our extensive catalog of cattle from trusted sellers across the country.",
        icon: "🔍",
      },
      {
        title: "Contact Seller",
        description: "Use our secure chat system to discuss details and negotiate with the seller directly.",
        icon: "💬",
      },
      {
        title: "Inspect & Purchase",
        description: "Arrange to inspect the animal in person before finalizing your purchase.",
        icon: "🤝",
      },
      {
        title: "Arrange Delivery",
        description: "Coordinate with the seller for pickup or delivery of your animal for Qurbani.",
        icon: "🚚",
      },
    ]
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full text-2xl mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  