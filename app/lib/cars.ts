export type Car = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  image: string;
  alt: string;
};

export const cars: Car[] = [
  {
    id: "maruti-brezza-zxi",
    name: "Maruti Suzuki Brezza ZXi",
    brand: "Maruti Suzuki",
    category: "SUV",
    price: "₹11.2 Lakh",
    image: "/carImages/maruati.png",
    alt: "Maruti Suzuki Brezza SUV",
  },
  {
    id: "hyundai-creta-sx",
    name: "Hyundai Creta SX",
    brand: "Hyundai",
    category: "SUV",
    price: "₹16.3 Lakh",
    image: "/carImages/c3.png",
    alt: "Hyundai Creta SUV",
  },
  {
    id: "tata-punch-accomplished",
    name: "Tata Punch Accomplished",
    brand: "Tata",
    category: "SUV",
    price: "₹9.1 Lakh",
    image: "/carImages/punch%20(2).png",
    alt: "Tata Punch SUV",
  },
  {
    id: "kia-sonet-gtx",
    name: "Kia Sonet GTX",
    brand: "Kia",
    category: "SUV",
    price: "₹14.4 Lakh",
    image: "/carImages/sonet.png",
    alt: "Kia Sonet SUV",
  },
  {
    id: "renault-duster-techno",
    name: "Renault Duster Techno",
    brand: "Renault",
    category: "SUV",
    price: "₹15.8 Lakh",
    image: "/carImages/Duster.png",
    alt: "Renault Duster SUV",
  },
  {
    id: "tata-nexon-creative",
    name: "Tata Nexon Creative",
    brand: "Tata",
    category: "SUV",
    price: "₹12.6 Lakh",
    image: "/carImages/punch%20(2).png",
    alt: "Tata Nexon SUV",
  },
];

export function getCarById(id: string) {
  return cars.find((car) => car.id === id);
}

export const carBrands = [...new Set(cars.map((car) => car.brand))];
