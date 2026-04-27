import { ShieldCheck, Truck, Gift, Star } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#411900]" />,
      title: "Trusted Quality",
      desc: "We deliver only fresh flowers and premium decorations with 100% quality assurance."
    },
    {
      icon: <Truck className="w-10 h-10 text-[#411900]" />,
      title: "Fast Delivery",
      desc: "Same-day delivery to make sure your celebrations are never delayed."
    },
    {
      icon: <Gift className="w-10 h-10 text-[#411900]" />,
      title: "Perfect for Every Occasion",
      desc: "From Ganapati to birthdays, we’ve got decorations and gifts for all festivals."
    },
    {
      icon: <Star className="w-10 h-10 text-[#411900]" />,
      title: "Customer Satisfaction",
      desc: "Thousands of happy customers trust Decorito for their special moments."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#411900] mb-12">
          Why Choose <span className="text-yellow-600">Decorito?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
