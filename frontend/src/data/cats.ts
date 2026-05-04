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
    id: 'katya',
    name: 'Катя',
    age: '3 года',
    breed: 'Домашняя короткошёрстная',
    color: 'Рыжая с белыми пятнами',
    description: 'Любит спать на клавиатуре и воровать еду со стола. Главная хозяйка дома.',
    image: '/images/cat-katya.jpg',
  },
  {
    id: 'gavrik',
    name: 'Гаврик',
    age: '4 года',
    breed: 'Британская короткошёрстная',
    color: 'Серый',
    description: 'Уличный боец, но боится пылесоса. Самый ласковый кот в мире.',
    image: '/images/cat-gavrik.jpg',
  },
];