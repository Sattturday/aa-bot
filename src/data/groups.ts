export type Groups = {
  key: string;
  name: string;
  address: string;
  description: string;
  mapLink: string;
  videoPath: string;
  imageUrl: string;
  phone: string;
  schedule: {
    days: string[];
    time: string;
  }[];
  notes: string;
  city: string;
}[]


export const groups: Groups = [
  {
    key: 'group_12_21',
    name: "12:21",
    address: "г. Чебоксары, ул. Комбинатская, 5.",
    description: 'Проезд: ост. ХБК, 50 метров сторону Вечного огня. Вход на цокольный офисный этаж, ориентир Автозапчасти.',
    mapLink: "https://yandex.ru/maps/-/CDqKz4kn",
    videoPath: "https://vk.com/clip-213121988_456239029",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (900) 332-62-60",
    schedule: [
      { days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], time: "19:00" }
    ],
    notes: "Последнее собрание месяца — открытое, в праздничные дни собрания проводятся.",
    city: "Чебоксары",
  },
  {
    key: 'group_exit',
    name: "Выход есть",
    address: "г. Чебоксары, ул. Пирогова 6 К 3.",
    description: 'Вход с торца, 4 кабинет, отделение медицинской реабилитации для лиц с наркологическими расстройствами.',
    mapLink: "https://yandex.ru/maps/-/CDb7iL~h",
    videoPath: "https://vk.com/clip-213121988_456239031",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (908) 305-21-35",
    schedule: [
      { days: ["Пн", "Чт"], time: "18:00" }
    ],
    notes: "В праздничные дни собрания не проводятся.",
    city: "Чебоксары",
  },
  {
    key: 'group_steps',
    name: "Ступени",
    address: "г. Чебоксары, ул. Патриса Лумумбы, 8.",
    description: 'Учебно-деловой центр, второй этаж, каб.203.',
    mapLink: "https://yandex.ru/maps/-/CDqKzAll",
    videoPath: "https://vk.com/clip-213121988_456239025",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (902) 328-02-52",
    schedule: [
      { days: ["Пн", "Ср", "Пт"], time: "18:30" }
    ],
    notes: "Первое собрание месяца — открытое, в праздничные дни собрания проводятся.",
    city: "Чебоксары",
  },
  {
    key: 'group_nochnaya',
    name: "Ночная",
    address: "г. Чебоксары, пр. Ивана Яковлева, д. 2а.",
    description: 'Чувашавтодор, второй этаж, каб 223.',
    mapLink: "https://yandex.ru/maps/-/CDqKzIjo",
    videoPath: "https://vk.com/clip-213121988_456239026",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (908) 301-84-92",
    schedule: [
      { days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], time: "20:00" }
    ],
    notes: "Первое собрание месяца — открытое, в праздничные дни собрания проводятся.",
    city: "Чебоксары",
  },
  {
    key: 'group_istochnik',
    name: "Источник",
    address: "г. Чебоксары, ул. Гузовского, 14.",
    description: 'Вход со стороны дороги, у входа вывеска Парикмахерская.',
    mapLink: "https://yandex.ru/maps/-/CDb7iHkq",
    videoPath: "https://vk.com/clip-213121988_456239030",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (8352) 37-57-21",
    schedule: [
      { days: ["Вт", "Пт"], time: "18:30" },
      { days: ["Вс"], time: "15:00" }
    ],
    notes: "Первое собрание месяца — открытое, в праздничные дни собрания проводятся.",
    city: "Чебоксары",
  },
  {
    key: 'group_avgust',
    name: "Август",
    address: "г. Новочебоксарск, ул. Коммунистическая, 27, корп. 5.",
    description: 'Главный вход, напротив каб. 6 спуск вниз, направо.',
    mapLink: "https://yandex.ru/maps/-/CDdeMPMr",
    videoPath: "https://vk.com/clip-213121988_456239069",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (919) 662-56-34",
    schedule: [
      { days: ["Чт"], time: "18:00" }
    ],
    notes: "В праздничные дни собрания не проводятся.",
    city: "Новочебоксарск",
  },
  {
    key: 'group_naberezhnaya',
    name: "Набережная",
    address: "г. Новочебоксарск, ул. Семёнова, 15.",
    description: 'ЖЭК управдома, актовый зал.',
    mapLink: "https://yandex.ru/maps/-/CDqKvX4~",
    videoPath: "https://vk.com/clip-213121988_456239027",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (902) 019-70-50",
    schedule: [
      { days: ["Вт", "Чт"], time: "18:30" }
    ],
    notes: "Первое собрание месяца — открытое, в праздничные дни собрания проводятся.",
    city: "Новочебоксарск",
  },
  {
    key: 'group_novaya',
    name: "Новая",
    address: "г. Новочебоксарск, ул. Винокурова, 42Д.",
    description: 'ТД Эссен, вход с торца, со стороны «Вкусно и точка».',
    mapLink: "https://yandex.ru/maps/-/CDb7mApP",
    videoPath: "https://vk.com/clip-213121988_456239033",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    phone: "+7 (919) 662-56-34",
    schedule: [
      { days: ["Пн", "Ср", "Пт", "Сб", "Вс"], time: "18:30" }
    ],
    notes: "Последнее собрание месяца — открытое, в праздничные дни собрания проводятся.",
    city: "Новочебоксарск",
  },
  {
    key: 'group_irek',
    name: "Ирек",
    address: "г. Канаш, ул. Разина, д. 56/2.",
    description: '',
    mapLink: "https://yandex.ru/maps/-/CDqKv0kL",
    imageUrl: "https://sun9-11.userapi.com/impg/qC1fAbXXOdXNVZR7ivcwLsGoelRzfWNMYcFseQ/X7ONQ9cey-4.jpg?size=1545x1020&quality=95&sign=7de041a35481dedb7133cd16f65b45ce&type=album",
    videoPath: "",
    phone: "+7 (927) 856-20-00",
    schedule: [
      { days: ["Пт"], time: "18:30" }
    ],
    notes: "",
    city: "Канаш",
  },
];