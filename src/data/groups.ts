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
}[];

export const groups: Groups = [
  {
    key: 'group_12_21',
    name: '12:21',
    address: 'г. Чебоксары, ул. Комбинатская, 5.',
    description:
      'Проезд: ост. ХБК, 50 метров сторону Вечного огня. Вход на цокольный офисный этаж, ориентир Автозапчасти.',
    mapLink: 'https://yandex.ru/maps/-/CDqKz4kn',
    videoPath: 'https://vk.com/clip-213121988_456239029',
    imageUrl:
      'https://sun9-80.userapi.com/impg/AVt6GxrbDMNIeGS5hdIghphA39e-AlSubZzH6A/vPbHZJtv7P8.jpg?size=2560x1920&quality=95&sign=873a4104e6aa8ac03e1bd61fa4f8aed4&type=album',
    phone: '+7 (900) 332-62-60',
    schedule: [
      { days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], time: '19:00' },
    ],
    notes:
      'Последнее собрание месяца — открытое, в праздничные дни собрания проводятся.',
    city: 'Чебоксары',
  },
  {
    key: 'group_exit',
    name: 'Выход есть',
    address: 'г. Чебоксары, ул. Пирогова 6 К 3.',
    description:
      'Вход с торца, 4 кабинет, отделение медицинской реабилитации для лиц с наркологическими расстройствами.',
    mapLink: 'https://yandex.ru/maps/-/CDb7iL~h',
    videoPath: 'https://vk.com/clip-213121988_456239031',
    imageUrl:
      'https://sun9-7.userapi.com/impg/W5nDlTWcWvL7f1zv9urD5Zw1tbhkucD6rbE0XA/tpfzvh20ns0.jpg?size=1440x1920&quality=95&sign=d881267a1f4f8b682fa5131e5d3b535f&type=album',
    phone: '+7 (908) 305-21-35',
    schedule: [{ days: ['Пн', 'Чт'], time: '18:00' }],
    notes: 'В праздничные дни собрания не проводятся.',
    city: 'Чебоксары',
  },
  {
    key: 'group_steps',
    name: 'Ступени',
    address: 'г. Чебоксары, ул. Патриса Лумумбы, 8.',
    description: 'Учебно-деловой центр, второй этаж, каб.203.',
    mapLink: 'https://yandex.ru/maps/-/CDqKzAll',
    videoPath: 'https://vk.com/clip-213121988_456239025',
    imageUrl:
      'https://sun9-62.userapi.com/impg/xJDcroKOam4Y4b6VMB90bcyH9qN-GiT4u5i71g/YPb8oTS534k.jpg?size=2560x1920&quality=95&sign=3c6ef6e08a970f52af73d5d86765b77c&type=album',
    phone: '+7 (902) 328-02-52',
    schedule: [{ days: ['Пн', 'Ср', 'Пт'], time: '18:30' }],
    notes:
      'Первое собрание месяца — открытое, в праздничные дни собрания проводятся.',
    city: 'Чебоксары',
  },
  {
    key: 'group_nochnaya',
    name: 'Ночная',
    address: 'г. Чебоксары, пр. Ивана Яковлева, д. 2а.',
    description: 'Чувашавтодор, второй этаж, каб 223.',
    mapLink: 'https://yandex.ru/maps/-/CDqKzIjo',
    videoPath: 'https://vk.com/clip-213121988_456239026',
    imageUrl:
      'https://sun9-26.userapi.com/impg/6AooTmwxSISawcQZEBVR17lI0VhobFTesEugeg/ZaU9fZlHr1Y.jpg?size=878x530&quality=95&sign=1cf7609f65ae9b25b81bfd797c86675a&type=album',
    phone: '+7 (908) 301-84-92',
    schedule: [
      { days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], time: '20:00' },
    ],
    notes:
      'Первое собрание месяца — открытое, в праздничные дни собрания проводятся.',
    city: 'Чебоксары',
  },
  {
    key: 'group_istochnik',
    name: 'Источник',
    address: 'г. Чебоксары, ул. Гузовского, 14.',
    description: 'Вход со стороны дороги, у входа вывеска Парикмахерская.',
    mapLink: 'https://yandex.ru/maps/-/CDb7iHkq',
    videoPath: 'https://vk.com/clip-213121988_456239030',
    imageUrl:
      'https://sun9-34.userapi.com/impg/BYlMhC0NC73v0NAQML1JJ-80AtCLtPDhEyURsw/kO1RgKVsDgU.jpg?size=1280x960&quality=95&sign=129926ac15c4522446d6d9f539e5deda&type=album',
    phone: '+7 (8352) 37-57-21',
    schedule: [
      { days: ['Вт', 'Пт'], time: '18:30' },
      { days: ['Вс'], time: '15:00' },
    ],
    notes:
      'Первое собрание месяца — открытое, в праздничные дни собрания проводятся.',
    city: 'Чебоксары',
  },
  {
    key: 'group_avgust',
    name: 'Август',
    address: 'г. Новочебоксарск, ул. Коммунистическая, 27, корп. 5.',
    description: 'Главный вход, напротив каб. 6 спуск вниз, направо.',
    mapLink: 'https://yandex.ru/maps/-/CDdeMPMr',
    videoPath: 'https://vk.com/clip-213121988_456239069',
    imageUrl:
      'https://sun9-34.userapi.com/impg/psp54bOzNxfK6mo5-Hzt-0_1k-S92tlJ8DYK3g/maFWQ_HTVXs.jpg?size=1343x758&quality=95&sign=7e180543c839922d2cea0b797519d1c5&type=album',
    phone: '+7 (919) 662-56-34',
    schedule: [{ days: ['Чт'], time: '18:00' }],
    notes: 'В праздничные дни собрания не проводятся.',
    city: 'Новочебоксарск',
  },
  {
    key: 'group_naberezhnaya',
    name: 'Набережная',
    address: 'г. Новочебоксарск, ул. Семёнова, 15.',
    description: 'ЖЭК управдома, актовый зал.',
    mapLink: 'https://yandex.ru/maps/-/CDqKvX4~',
    videoPath: 'https://vk.com/clip-213121988_456239027',
    imageUrl:
      'https://sun9-48.userapi.com/impg/BrQzYibmf4eITlvrnxhZhJAM-ooMHWefkgu4Gg/1Izs1yC_JyM.jpg?size=1280x1280&quality=95&sign=15747f12912228c803a892dd94258886&type=album',
    phone: '+7 (902) 019-70-50',
    schedule: [{ days: ['Вт', 'Чт'], time: '18:30' }],
    notes:
      'Первое собрание месяца — открытое, в праздничные дни собрания проводятся.',
    city: 'Новочебоксарск',
  },
  {
    key: 'group_novaya',
    name: 'Новая',
    address: 'г. Новочебоксарск, ул. Винокурова, 42Д.',
    description: 'ТД Эссен, вход с торца, со стороны «Вкусно и точка».',
    mapLink: 'https://yandex.ru/maps/-/CDb7mApP',
    videoPath: 'https://vk.com/clip-213121988_456239033',
    imageUrl:
      'https://sun9-25.userapi.com/impg/v6Lao9gf0X3Eve9fNG0pWeU_5AV6t7n78nBvUw/4dNHX1OqQac.jpg?size=1280x960&quality=95&sign=a07147ca2840606b16481f4d01c9f969&type=album',
    phone: '+7 (919) 662-56-34',
    schedule: [{ days: ['Пн', 'Ср', 'Пт', 'Сб', 'Вс'], time: '18:30' }],
    notes:
      'Последнее собрание месяца — открытое, в праздничные дни собрания проводятся.',
    city: 'Новочебоксарск',
  },
  {
    key: 'group_irek',
    name: 'Ирек',
    address: 'г. Канаш, ул. Разина, д. 56/2.',
    description: '',
    mapLink: 'https://yandex.ru/maps/-/CDqKv0kL',
    imageUrl:
      'https://sun9-13.userapi.com/impg/o4sId9ilIpxawKfN3QvBi-T2vgt-yA9M-K8WOA/sMy6uZXoUAU.jpg?size=1255x942&quality=95&sign=35e8417c43f0dc2667fc583ab223bf2f&type=album',
    videoPath: '',
    phone: '+7 (927) 856-20-00',
    schedule: [{ days: ['Пт'], time: '18:30' }],
    notes: '',
    city: 'Канаш',
  },
];
