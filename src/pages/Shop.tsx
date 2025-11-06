import { useState } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { usePetStats } from '../hooks/usePetStats';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
  image: string;
  available: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 'plushie',
    name: 'AOMIGO Plushie',
    price: 24.99,
    description: 'Bring your pet home! Soft, cuddly, and always ready to learn with you.',
    emoji: '🐶',
    image: '🧸',
    available: true,
  },
  {
    id: 'pillow',
    name: 'Travel Pillow',
    price: 19.99,
    description: 'Stay connected on the go! Perfect for studying anywhere.',
    emoji: '✈️',
    image: '🛌',
    available: true,
  },
  {
    id: 'device',
    name: 'Smart Device',
    price: 49.99,
    description: 'AI pet in your pocket! Coming soon - notify me when available.',
    emoji: '📱',
    image: '📱',
    available: false,
  },
  {
    id: 'stickers',
    name: 'Sticker Pack',
    price: 7.99,
    description: 'Decorate everything! 20+ fun AOMIGO stickers.',
    emoji: '🎨',
    image: '⭐',
    available: true,
  },
  {
    id: 'notebook',
    name: 'Learning Journal',
    price: 14.99,
    description: 'Write down what you teach! Premium notebook with guided pages.',
    emoji: '📓',
    image: '📖',
    available: true,
  },
  {
    id: 'tshirt',
    name: 'AOMIGO T-Shirt',
    price: 22.99,
    description: 'Wear your learning pride! Soft cotton with fun designs.',
    emoji: '👕',
    image: '👕',
    available: true,
  },
];

export function Shop() {
  const { profile } = usePetStats();
  const [cart, setCart] = useState<string[]>([]);

  function addToCart(productId: string) {
    setCart(prev => [...prev, productId]);
    toast.success('Added to cart!');
  }

  function handleNotify(productName: string) {
    toast.success(`We'll notify you when ${productName} is available!`);
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-brown-700 flex items-center gap-3">
              <ShoppingCart className="w-10 h-10 text-orange-600" />
              AOMIGO Shop
            </h1>
            <p className="text-brown-600 mt-2 text-lg">Get physical companions and gear!</p>
          </div>

          {cart.length > 0 && (
            <div className="relative">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2 cartoon-button">
                <ShoppingCart className="w-5 h-5" />
                Cart ({cart.length})
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg shadow-orange-100 overflow-hidden hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                <span className="text-8xl">{product.image}</span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-brown-700 flex items-center gap-2">
                    {product.emoji} {product.name}
                  </h3>
                  {!product.available && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>

                <p className="text-brown-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    ${product.price}
                  </span>

                  {product.available ? (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-transform"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNotify(product.name)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Notify Me
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg shadow-orange-100 p-8 text-center">
          <Package className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brown-700 mb-3">
            Free Shipping on Orders Over $50!
          </h2>
          <p className="text-brown-600 mb-6">
            All AOMIGO products come with a 30-day satisfaction guarantee.
            Learn better, together!
          </p>
          <p className="text-2xl font-bold text-orange-600">
            Together We Got This 🐶
          </p>
        </div>
      </div>
    </div>
  );
}
