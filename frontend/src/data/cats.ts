export interface Cat {
  id: string;
  name: string;
  age: string;
  breed: string;
  color: string;
  description: string;
  image: string;
}

export const cats: Cat[] = [
  {
    id: "katya",
    name: "Катя",
    age: "4 года",
    breed: "домашняя «дворянка»",
    color: "Рыжая с белыми пятнами",
    description: "Психованная дама, пугливая до чертиков",
    image: "/images/cat-katya.jpg",
  },
  {
    id: "gavrik",
    name: "Гаврик",
    age: "4 года",
    breed: "домашний, «дворянин»",
    color: "Серый/белый",
    description:
      "Попрошайка каких свет не видовал, не боится пылесоса. Самый ласковый кот в мире.",
    image: "/images/cat-gavrik.jpg",
  },
];
