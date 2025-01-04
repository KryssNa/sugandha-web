export // Types
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface Order {
    id: string;
    date: string;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: OrderItem[];
    trackingNumber?: string;
    estimatedDelivery?: string;
}

