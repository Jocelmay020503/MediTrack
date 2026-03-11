export interface DefaultMedicineInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  instructions: string;
  expiryDate: Date;
}

export const DEFAULT_MEDICINES: DefaultMedicineInput[] = [
  {
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    price: 25,
    stock: 150,
    image: '/logo.PNG',
    instructions: 'Every 4 hours, take with meals',
    expiryDate: new Date('2026-12-31'),
  },
  {
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    price: 85,
    stock: 80,
    image: '/logo.PNG',
    instructions: 'Every 8 hours, take with meals',
    expiryDate: new Date('2026-11-30'),
  },
  {
    name: 'Cetirizine 10mg',
    category: 'Allergy',
    price: 45,
    stock: 120,
    image: '/logo.PNG',
    instructions: 'Once daily, take at night',
    expiryDate: new Date('2027-01-31'),
  },
];
