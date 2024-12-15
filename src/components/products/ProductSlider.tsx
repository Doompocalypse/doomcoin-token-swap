import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";

const products = [
  {
    id: "1",
    name: "Quantum Combat Suit",
    description: "Advanced armor with integrated AI assistance and stealth capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    price: 299.99
  },
  {
    id: "2",
    name: "Neural Interface Kit",
    description: "Direct brain-computer interface for enhanced reaction times.",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    price: 199.99
  },
  {
    id: "3",
    name: "Nano-Med Pack",
    description: "Emergency medical nanobots for rapid healing and recovery.",
    imageUrl: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    price: 149.99
  },
  {
    id: "4",
    name: "Plasma Shield Generator",
    description: "Personal force field generator for ultimate protection.",
    imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    price: 399.99
  }
];

const ProductSlider = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <ProductCard {...product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -left-12 top-1/2 -translate-y-1/2">
          <CarouselPrevious className="relative left-0" />
        </div>
        <div className="absolute -right-12 top-1/2 -translate-y-1/2">
          <CarouselNext className="relative right-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default ProductSlider;