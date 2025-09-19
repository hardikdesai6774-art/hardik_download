const BackersSection = () => {
  const backers = [
    { name: "IndiaQuotient", base: "/backers/indiaquotient" },
    { name: "ELEVATION", base: "/backers/elevation" },
    { name: "PUBG Corporation", base: "/backers/pubg" },
    { name: "KRAFTON", base: "/backers/krafton" },
  ];

  return (
    <section className="py-12 md:py-16 px-4 bg-white" data-aos="fade-up">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Backed by
          </h2>
          <p className="text-gray-500">
            Trusted by leading investors and industry partners
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-center max-w-4xl mx-auto">
          {backers.map((backer, index) => (
            <div key={index} className="flex justify-center">
              <div className="relative group">
                <img
                  src={`${backer.base}.svg`}
                  alt={backer.name}
                  className="h-12 md:h-16 w-auto object-contain opacity-100 md:opacity-80 md:grayscale md:hover:grayscale-0 md:hover:opacity-100 transition-all duration-300"
                  decoding="async"
                  loading={index === 0 ? "eager" : "lazy"}
                  // @ts-ignore - fetchPriority may not be in older TS DOM types
                  fetchPriority={index === 0 ? "high" : "auto"}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    // First fallback: try PNG if SVG missing
                    if (!el.dataset.fallbackTriedPng) {
                      el.dataset.fallbackTriedPng = "true";
                      el.src = `${backer.base}.png`;
                      return;
                    }
                    // Second fallback: generic placeholder to avoid broken icon
                    if (el.src.indexOf("/placeholder.svg") === -1) {
                      el.src = "/placeholder.svg";
                    }
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BackersSection;