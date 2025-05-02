
interface CatalogHeroProps {
  title: string;
  description: string;
  backgroundImage: string;
}

const CatalogHero = ({ title, description, backgroundImage }: CatalogHeroProps) => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-black/50" />
      <div 
        className="relative flex h-[40vh] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
