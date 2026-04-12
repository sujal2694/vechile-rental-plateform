import logo_1 from './logo-img-1.jpeg';
import logo_2 from './logo-img-2.jpeg';
import vehicle_1 from './hyundai-creta.jpg';
import vehicle_2 from './honda-city.jpeg';
import vehicle_3 from './hyundai-elantra.jpg';
import vehicle_4 from './hyundai-aura.webp';
import vehicle_5 from './hyundai-i20.jpg';
import vehicle_6 from './mercedec-benz-s-class.png';
import vehicle_7 from './honda-amaze.png';
import vehicle_8 from './kia-seltos.png';
import vehicle_9 from './mahindra-xuv-3xo.png';
import vehicle_10 from './maruti-suzuki-dezire.png';
import vehicle_11 from './tata-tigor.png';
export const assets = {
    logo_1,
    logo_2,
}

export const vehicles = [
    {
        id: 1,
        name: "Hyundai Creta",
        category: "Economy",
        price: "$40/day",
        image: vehicle_1,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        rating: 4.5
    },
    {
        id: 2,
        name: "Honda City",
        category: "Economy",
        price: "$75/day",
        image: vehicle_2,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        rating: 4.8
    },
    {
        id: 3,
        name: "Hyundai Elantra",
        category: "Premium",
        price: "$120/day",
        image: vehicle_3,
        seats: 5,
        transmission: "Automatic",
        fuel: "Diesel",
        rating: 4.9
    },
    {
        id: 4,
        name: "Hyundai Aura",
        category: "Compact",
        price: "$90/day",
        image: vehicle_4,
        seats: 5,
        transmission: "Manual",
        fuel: "Diesel",
        rating: 4.6
    },
    {
        id: 5,
        name: "Hyundai i20",
        category: "Compact",
        price: "$35/day",
        image: vehicle_5,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        rating: 4.4
    },
    {
        id: 6,
        name: "Mercedes-Benz C-Class",
        category: "Luxury",
        price: "$150/day",
        image: vehicle_6,
        seats: 5,
        transmission: "Automatic",
        fuel: "Diesel",
        rating: 5.0
    },
    {
        id: 7,
        name: "Honda Amaze",
        category: "Compact",
        price: "$30/day",
        image: vehicle_7,
        seats: 5,
        transmission: "Automatic",
        fuel: "Diesel",
        rating: 5.0
    },
    {
        id: 8,
        name: "Kia Seltos",
        category: "SUV",
        price: "$50/day",
        image: vehicle_8,
        seats: 5,
        transmission: "Manual",
        fuel: "Diesel",
        rating: 4.3
    },
    {
        id: 9,
        name: "Mahindra XUV 3X0",
        category: "SUV",
        price: "$45/day",
        image: vehicle_9,
        seats: 5,
        transmission: "Manual",
        fuel: "Diesel",
        rating: 4.2
    },
    {
        id: 10,
        name: "Maruti Suzuki Dzire",
        category: "Compact",
        price: "$25/day",
        image: vehicle_10,
        seats: 5,
        transmission: "Manual",
        fuel: "Petrol",
        rating: 4.1
    },
    {
        id:11,
        name:"Tata Tigor",
        category: "compact",
        price:"$30/day",
        image:vehicle_11,
        seats: 5,
        transmission: "Manual",
        fuel: "Petrol",
        rating: 4.3
    }
]

export const features = [
    {
        id: 1,
        title: "Wide Selection",
        description: "Choose from hundreds of vehicles ranging from economy cars to luxury SUVs",
        icon: "bx-car"
    },
    {
        id: 2,
        title: "Best Prices",
        description: "Competitive rates with transparent pricing and no hidden charges",
        icon: "bx-dollar-circle"
    },
    {
        id: 3,
        title: "24/7 Support",
        description: "Dedicated customer support available round the clock for your convenience",
        icon: "bx-headphone"
    },
    {
        id: 4,
        title: "Free Insurance",
        description: "Comprehensive insurance coverage included with every rental",
        icon: "bx-badge-check"
    },
    {
        id: 5,
        title: "Easy Booking",
        description: "Simple online booking process that takes less than 2 minutes",
        icon: "bx-calendar"
    },
    {
        id: 6,
        title: "Free Cancellation",
        description: "Cancel your booking anytime up to 24 hours before pickup",
        icon: "bx-undo"
    }
]

export const testimonials = [
    {
        id: 1,
        name: "John Smith",
        role: "Business Traveler",
        comment: "MotiveRide made my trip so convenient. Great vehicles and excellent service!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Tour Guide",
        comment: "Reliable cars, affordable prices, and friendly staff. Highly recommended!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
        id: 3,
        name: "Mike Williams",
        role: "Weekend Explorer",
        comment: "Best car rental service I've used. Will definitely book again!",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    }
]

export const faqs = [
    {
        id: 1,
        question: "What documents do I need to rent a car?",
        answer: "You'll need a valid driving license, passport/ID, and a credit card. Additional documents may be required depending on your country of residence."
    },
    {
        id: 2,
        question: "What is your cancellation policy?",
        answer: "You can cancel your booking free of charge up to 24 hours before the pickup time. Cancellations made after this will be charged accordingly."
    },
    {
        id: 3,
        question: "Is fuel included in the rental?",
        answer: "No, you're responsible for refueling. You can choose to prepay for fuel or refuel yourself. We offer a fuel surcharge option for convenience."
    },
    {
        id: 4,
        question: "What if I damage the car?",
        answer: "All our vehicles come with comprehensive insurance coverage. Depending on your policy, you may be liable for the deductible amount for any damage."
    },
    {
        id: 5,
        question: "Can I extend my rental period?",
        answer: "Yes, you can extend your rental anytime, subject to vehicle availability. Contact our support team or manage it through your account."
    },
    {
        id: 6,
        question: "What is the minimum age to rent a car?",
        answer: "The minimum age is 18 years. However, drivers under 25 may be subject to additional charges."
    }
]