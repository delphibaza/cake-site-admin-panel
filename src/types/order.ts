
// Типы данных для заказов
export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  status: "new" | "processing" | "completed" | "cancelled";
  items: OrderItem[];
  total: number;
}

// Демо данные для заказов
export const sampleOrders: Order[] = [
  {
    id: 1001,
    customerName: "Елена Иванова",
    customerPhone: "+7 (905) 123-45-67",
    customerAddress: "ул. Пушкина, д. 10, кв. 42",
    date: "2025-04-28",
    status: "new",
    items: [
      { id: 1, productId: 1, name: "Шоколадный торт", price: 1200, quantity: 1 },
      { id: 2, productId: 3, name: "Морковный торт", price: 1300, quantity: 1 }
    ],
    total: 2500
  },
  {
    id: 1002,
    customerName: "Александр Петров",
    customerPhone: "+7 (912) 987-65-43",
    customerAddress: "просп. Ленина, д. 23, кв. 15",
    date: "2025-04-27",
    status: "processing",
    items: [
      { id: 3, productId: 4, name: "Чизкейк Нью-Йорк", price: 1500, quantity: 2 }
    ],
    total: 3000
  },
  {
    id: 1003,
    customerName: "Мария Сидорова",
    customerPhone: "+7 (925) 456-78-90",
    customerAddress: "ул. Гоголя, д. 5, кв. 78",
    date: "2025-04-25",
    status: "completed",
    items: [
      { id: 4, productId: 2, name: "Клубничный торт", price: 1400, quantity: 1 },
      { id: 5, productId: 6, name: "Наполеон", price: 1200, quantity: 1 },
      { id: 6, productId: 5, name: "Медовик", price: 1100, quantity: 1 }
    ],
    total: 3700
  },
  {
    id: 1004,
    customerName: "Василий Кузнецов",
    customerPhone: "+7 (916) 111-22-33",
    customerAddress: "ул. Чехова, д. 17, кв. 33",
    date: "2025-04-22",
    status: "cancelled",
    items: [
      { id: 7, productId: 1, name: "Шоколадный торт", price: 1200, quantity: 2 }
    ],
    total: 2400
  }
];
