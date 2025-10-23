import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  article: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image?: string;
  characteristics: Record<string, string>;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}

const sampleProducts: Product[] = [
  {
    id: '1',
    article: 'ART-001',
    name: 'Болт М8x60',
    category: 'Крепёж',
    price: 12.50,
    unit: 'шт',
    stock: 1500,
    image: 'https://cdn.poehali.dev/projects/c0e866ce-efcd-42df-8db1-63e0ee2fafc0/files/bc764a00-44b0-400b-bd9c-72082ed23b7b.jpg',
    characteristics: { 'Материал': 'Сталь', 'Покрытие': 'Цинк' }
  },
  {
    id: '2',
    article: 'ART-002',
    name: 'Гайка М8',
    category: 'Крепёж',
    price: 5.30,
    unit: 'шт',
    stock: 2000,
    image: 'https://cdn.poehali.dev/projects/c0e866ce-efcd-42df-8db1-63e0ee2fafc0/files/78761fe7-95c4-4952-974e-207cfed05c7d.jpg',
    characteristics: { 'Материал': 'Сталь', 'Класс': '8' }
  },
  {
    id: '3',
    article: 'ART-003',
    name: 'Шайба 8мм',
    category: 'Крепёж',
    price: 2.10,
    unit: 'шт',
    stock: 3000,
    image: 'https://cdn.poehali.dev/projects/c0e866ce-efcd-42df-8db1-63e0ee2fafc0/files/e0dd137a-5068-4f4e-b828-cdce0a100695.jpg',
    characteristics: { 'Материал': 'Сталь', 'Толщина': '2мм' }
  },
  {
    id: '4',
    article: 'ART-004',
    name: 'Винт М6x40',
    category: 'Крепёж',
    price: 8.90,
    unit: 'шт',
    stock: 800,
    image: 'https://cdn.poehali.dev/projects/c0e866ce-efcd-42df-8db1-63e0ee2fafc0/files/bc764a00-44b0-400b-bd9c-72082ed23b7b.jpg',
    characteristics: { 'Материал': 'Нерж. сталь', 'Тип': 'DIN 912' }
  },
  {
    id: '5',
    article: 'ART-005',
    name: 'Анкер 10x100',
    category: 'Крепёж',
    price: 45.00,
    unit: 'шт',
    stock: 500,
    image: 'https://cdn.poehali.dev/projects/c0e866ce-efcd-42df-8db1-63e0ee2fafc0/files/78761fe7-95c4-4952-974e-207cfed05c7d.jpg',
    characteristics: { 'Материал': 'Сталь', 'Нагрузка': '500кг' }
  },
  {
    id: '6',
    article: 'ART-006',
    name: 'Саморез 4.8x50',
    category: 'Крепёж',
    price: 3.20,
    unit: 'шт',
    stock: 5000,
    image: 'https://cdn.poehali.dev/projects/c0e866ce-efcd-42df-8db1-63e0ee2fafc0/files/e0dd137a-5068-4f4e-b828-cdce0a100695.jpg',
    characteristics: { 'Материал': 'Сталь', 'Покрытие': 'Фосфат' }
  }
];

const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-10-20',
    items: [
      { ...sampleProducts[0], quantity: 100 },
      { ...sampleProducts[1], quantity: 100 }
    ],
    total: 1780,
    status: 'completed'
  },
  {
    id: 'ORD-002',
    date: '2024-10-18',
    items: [
      { ...sampleProducts[2], quantity: 200 },
      { ...sampleProducts[3], quantity: 50 }
    ],
    total: 865,
    status: 'completed'
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders] = useState<Order[]>(sampleOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    
    toast({
      title: 'Товар добавлен',
      description: `${product.name} добавлен в корзину`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Package" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Система заказов</h1>
                <p className="text-sm text-muted-foreground">Управление номенклатурой</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Icon name="ShoppingCart" size={16} className="mr-1" />
                {cart.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="catalog" className="gap-2">
              <Icon name="LayoutGrid" size={16} />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="cart" className="gap-2">
              <Icon name="ShoppingCart" size={16} />
              Корзина
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Icon name="FileText" size={16} />
              История
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2">
              <Icon name="Database" size={16} />
              Справочники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, артикулу, категории..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  {product.image && (
                    <div className="aspect-square bg-muted/30 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className="font-mono text-xs">{product.article}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {Object.entries(product.characteristics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <div className="text-2xl font-bold text-primary">{product.price} ₽</div>
                        <div className="text-xs text-muted-foreground">
                          На складе: {product.stock} {product.unit}
                        </div>
                      </div>
                      <Button onClick={() => addToCart(product)} className="gap-2">
                        <Icon name="Plus" size={16} />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart" className="space-y-4">
            {cart.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">Корзина пуста</p>
                  <p className="text-sm text-muted-foreground mt-1">Добавьте товары из каталога</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4">
                  {cart.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground font-mono">{item.article}</p>
                            <div className="flex gap-2 mt-2">
                              {Object.entries(item.characteristics).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={16} />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="w-20 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={16} />
                              </Button>
                            </div>
                            
                            <div className="text-right min-w-[100px]">
                              <div className="text-xl font-bold text-primary">
                                {(item.price * item.quantity).toFixed(2)} ₽
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.price} ₽ × {item.quantity}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive"
                            >
                              <Icon name="Trash2" size={18} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Итого позиций: {cart.length}</p>
                        <p className="text-3xl font-bold text-primary mt-1">
                          {cartTotal.toFixed(2)} ₽
                        </p>
                      </div>
                      <Button size="lg" className="gap-2">
                        <Icon name="CheckCircle" size={20} />
                        Оформить заказ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Заказ {order.id}</CardTitle>
                      <CardDescription>{new Date(order.date).toLocaleDateString('ru-RU')}</CardDescription>
                    </div>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status === 'completed' ? 'Выполнен' : 'В обработке'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pb-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.article}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} ₽</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} шт</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 text-lg font-bold">
                      <span>Итого:</span>
                      <span className="text-primary">{order.total.toFixed(2)} ₽</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reference" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Tag" size={20} />
                    Категории
                  </CardTitle>
                  <CardDescription>Справочник категорий товаров</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from(new Set(sampleProducts.map(p => p.category))).map(category => (
                      <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">{category}</span>
                        <Badge variant="outline">
                          {sampleProducts.filter(p => p.category === category).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Box" size={20} />
                    Единицы измерения
                  </CardTitle>
                  <CardDescription>Справочник единиц измерения</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from(new Set(sampleProducts.map(p => p.unit))).map(unit => (
                      <div key={unit} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">{unit}</span>
                        <Badge variant="outline">
                          {sampleProducts.filter(p => p.unit === unit).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;