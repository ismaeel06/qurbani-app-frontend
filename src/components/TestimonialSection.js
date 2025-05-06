import { useTranslation } from "react-i18next";

export default function TestimonialSection() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ur';
    
    const testimonials = [
      {
        id: 1,
        quote:
          "I found the perfect cow for my Qurbani through this platform. The process was smooth and the seller was very honest.",
        author: "Ahmed Khan",
        location: "Karachi",
      },
      {
        id: 2,
        quote:
          "As a seller, I've been able to connect with buyers directly without middlemen. This has helped me get fair prices for my animals.",
        author: "Malik Farms",
        location: "Lahore",
      },
      {
        id: 3,
        quote:
          "The verification process gives me confidence that I'm dealing with legitimate sellers. Will definitely use again next year.",
        author: "Fatima Aziz",
        location: "Islamabad",
      },
    ]
  
    return (
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
            {t('home.testimonials')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md" dir={isRTL ? "rtl" : "ltr"}>
                <div className={`text-green-600 text-4xl mb-4 ${isRTL ? 'text-right' : ''}`}>"</div>
                <p className={`text-gray-700 mb-4 ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? t(`testimonials.${testimonial.id}.quote`) || testimonial.quote : testimonial.quote}
                </p>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="font-semibold">
                    {isRTL ? t(`testimonials.${testimonial.id}.author`) || testimonial.author : testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
