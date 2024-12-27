import { generateGroupScheduleMessage } from '../utils/utils';
import { groups } from './groups';

// Типы для сообщений
type Messages = {
  [key: string]: string;
};

const groupSchedule = generateGroupScheduleMessage(groups)
const step11Actions =
  "Действия 11 шага по БКАА\n" +
  "Утренняя Часть\n\n" +
  "Одиннадцатый шаг предлагает молитву и (медитацию) углубленное размышление. Она помогает при усердии и соответствующем отношении к ней. Мы можем предложить кое-что ценное и определенное.\n\n" +
  "1. Молитва в самом начале дня : \n" +
  "\"Боже, направь мои помыслы в верное русло, убереги меня от жалости к себе, от бесчестных поступков, корыстолюбия.\"\n\n" +
  "2. Утром, надо подумать о предстоящем дне.\n" +
  "Рассмотрим наши планы.\n" +
  "(Чтобы что -то рассмотреть, возможно это стоит написать)\n\n" +
  "3. Размышляя о предстоящем дне, если есть неуверенность или не способен решить, какие действия предпринять, молитва:\n" +
  "\"Боже, дай мне вдохновение, интуитивные мысли или решения.\"\n\n" +
  "4. Погружаемся в медитацию.\n" +
  "(Тихое время, углубленное размышление)\n" +
  "Мы успокаиваемся и не нервничаем. Мы ни с кем и ни с чем не боремся.\n\n" +
  "Заканчиваем период углубленного размышления молитвой : \n" +
  "\"Боже, открой (покажи) мне, каким должен быть мой следующий шаг, и дай мне все, что необходимо для решения моих проблем. Освободи меня от своеволия.\"\n\n" +
  "5. В течение дня, если появляются сомнения или волнения по какому-то поводу, нужно сделать паузу и попросить Бога:\n" +
  "\"Боже, укажи правильную мысль или действие\"\n\n" +
  "6. Мы постоянно напоминаем себе, что мы больше не мним себя центром вселенной, смиренно повторяя каждый день:\n" +
  "\"Да исполнится воля Твоя\"";

const eveningReflection =
  "Когда мы ложимся спать, мы мысленно оцениваем прожитый день.\n\n" +
  "Не были ли мы в течение дня злобными, эгоистичными или бесчестными?\n\n" +
  "Может, мы испытывали страх или должны извиниться перед кем-то?\n\n" +
  "Может, мы кое-что затаили про себя, что следует немедленно обсудить с кем-либо?\n\n" +
  "Проявляли ли мы любовь и доброту ко всем окружающим? Что мы могли бы сделать лучше?\n\n" +
  "Может, в основном мы думаем только о себе?\n\n" +
  "Или мы думали о том, что можем сделать для других, о нашем вкладе в общее течение жизни?\n\n" +
  "Не нужно только поддаваться беспокойству, угрызениям совести или мрачным размышлениям, ибо в этом случае наши возможности приносить пользу другим уменьшаются.\n\n" +
  "Вспомнив события прожитого дня, мы просим прощения у Бога и спрашиваем Его, как нам исправить наши ошибки.";

// сообщения
export const messages: Messages = {
  newbie:
    '😊 Выбери пункт, который тебя интересует\n\n📞 Горячая линия +7 (905) 346-65-67',
  participant: '😊 Выбери пункт, который тебя интересует',
  want_to_quit:
    'Только алкоголик сможет по настоящему понять другого алкоголика...\n\nНи один алкоголик не сможет дать ' +
    'разумного объяснения почему он пьет. Еще меньше он понимает как можно это прекратить. Программа 12 шагов ' +
    'предлагает нам Выход из тупика. Это Программа не только о том как перестать употреблять алкоголь, а и о том ' +
    'как научиться жить полноценной счастливой трезвой жизнью.',
  about_aa:
    'Анонимные Алкоголики - это Содружество, объединяющее мужчин и женщин, которые делятся друг с другом своим опытом, ' +
    'силами и надеждами с целью помочь себе и другим избавиться от алкоголизма.\n\nЧлены АА не платят ни вступительных, ни ' +
    'членских взносов. Мы сами себя содержим благодаря нашим добровольным пожертвованиям.\n\nАА не связано ни с какой сектой, ' +
    'вероисповеданием, политическим направлением, организацией или учреждением.\n\nВ работе АА используется программа 12 шагов.',
  steps: '12 шагов Анонимных Алкоголиков\n\n' +
    '1. Мы признали свое бессилие перед алкоголем, признали, что мы потеряли контроль над собой.\n' +
    '2. Пришли к убеждению, что только Сила более могущественная, чем мы, может вернуть нам здравомыслие.\n' +
    '3. Приняли решение препоручить нашу волю и нашу жизнь Богу, как мы Его понимали.\n' +
    '4. Глубоко и бесстрашно оценили себя и свою жизнь с нравственной точки зрения.\n' +
    '5. Признали перед Богом, собой и каким-либо другим человеком истинную природу наших заблуждений.\n' +
    '6. Полностью подготовили себя к тому, чтобы Бог избавил нас от всех наших недостатков.\n' +
    '7. Смиренно просили Его исправить наши изъяны.\n' +
    '8. Составили список всех тех людей, кому мы причинили зло, и преисполнились желанием загладить свою вину перед ними.\n' +
    '9. Лично возмещали причиненный этим людям ущерб, где только возможно, кроме тех случаев, когда это могло повредить им или кому-либо другому.\n' +
    '10. Продолжали самоанализ и, когда допускали ошибки, сразу признавали это.\n' +
    '11. Стремились путем молитвы и размышления углубить соприкосновение с Богом, как мы понимали Его, молясь лишь о знании Его воли, которую нам надлежит исполнить, и о даровании силы для этого.\n' +
    '12. Достигнув духовного пробуждения, к которому привели эти шаги, мы старались донести смысл наших идей до других алкоголиков и применять эти принципы во всех наших делах.',
  what_to_expect:
    'Наверное каждому алкоголику в Содружестве было очень страшно впервые прийти на группу. Что там происходит? Примут ли меня? ' +
    'Может быть мне это не подходит? Тысяча сомнений может одолевать страдающего алкоголика.\n\nНа собраниях групп АА доброжелательная атмосфера. Пришедшему даже не обязательно ' +
    'называть свое настоящее имя. Никто не будет вынуждать рассказывать о себе. Все по желанию и в комфортной обстановке. ' +
    'На многих группах АА есть чай, конфеты и угощения. Можно просто прийти и послушать опыт других алкоголиков, которым ' +
    'удается оставаться трезвыми продолжительное время.\n\nВсё, что мы обсуждаем, остаётся в стенах помещения группы. Анонимность – основа нашего Содружества.',
  literature:
    '📕 Приобрести литературу можно на любом собрании АA у ведущего или секретаря группы.\n\n👇 Также ознакомиться с литературой сообщества можно по кнопке ниже. ',
  group_schedule:
    'Чтобы посмотреть подробную информацию о группе, нажмите на кнопку ниже. 👇👇👇',
  faq: '👀 Здесь вы найдете ответы на наиболее типичные вопросы, которые задают новые члены Содружества, вопросы, волновавшие и нас самих, когда мы только пришли в АА.',
  answer_1: 'Если вы постоянно выпиваете больше, чем собирались, если начав пить, вы не можете остановиться, если у вас на этой почве возникают неприятности или случаются провалы памяти — то вполне вероятно, что вы стали алкоголиком. Определить это сможете только вы сами. В АА за вас этого никто делать не будет.',
  answer_2: 'АА состоит из мужчин и женщин, которые потеряли способность сдерживать свою тягу к спиртному и у которых в результате пьянства возникли самые разные проблемы. \n\nМы стремимся жить полноценной жизнью, в которой нет места алкоголю, и большинству из нас это удается. Однако, мы убедились в том, что для этого требуется помощь и поддержка других алкоголиков — членов АА.',
  answer_3: 'Если они там и будут, то по той же причине, что и вы, и о том, что вас встретили, они никому не расскажут. Став членом АА, вы можете сохранять анонимность в той мере, в которой захотите. Это одна из тех причин, по которым мы и называемся Анонимными Алкоголиками (АА).',
  answer_4: 'У нас нет списка членов, мы не ведем учета посещаемости. Вы не обязаны представляться или рассказывать о себе. Если вы решите больше не посещать собрания, то агитировать или надоедать вам никто не станет.\n\nНа собраниях АА — разнообразных по форме — выступающие алкоголики рассказывают, до чего довело их пьянство, что они делали, чтобы избавиться от этого недуга и как они живут теперь.',
  answer_5: 'Члены АА — вовсе не терапевты или наркологи. Но все мы знаем, что значит пристраститься к спиртному, обещать себе и другим бросить пить и быть не в состоянии выполнить это обещание. Единственный способ, которым мы можем помочь другим исцелиться от алкоголизма — это наш собственный пример. И люди, страдающие от алкоголизма, приходя к нам видят, что мы уже бросили пить и понимают на нашем примере, что исцелиться от алкоголизма можно.\n\nМы убедились в том, что в АА, как правило, исцеляются от алкоголизма те, кто:\n- воздерживается от «первой рюмки»;\n- регулярно посещает собрания АА;\n- перенимает опыт у тех членов АА, которые уже какое-то время не пьют;\n- следует принципам, изложенным в Программе АА по исцелению алкоголизма.',
  answer_6: 'Мы считаем, что «полностью выздороветь» от алкоголизма невозможно. Мы уже никогда не сможем просто пить «в компании» или «по случаю». И то, как мы сможем воздерживаться от употребления спиртного зависит от того, насколько мы будем здоровы физически, психически и душевно. \n\nДля того чтобы вести здоровый образ жизни, мы и ходим регулярно на собрания, приобретаем там новые знания и пользуемся ими. Кроме того, мы на собственном опыте убедились, что чем больше мы помогаем другим алкоголикам, тем меньше тянет к спиртному нас самих.',
  answer_7: 'Вы становитесь членом АА как только об этом заявите. Единственное условие для членства – это желание бросить пить. Именно «твердости» в этом вопросе многим из нас на первых порах и не хватало.',
  answer_8: 'Никаких членских взносов в АА не существует. Обычно на собраниях проводится сбор пожертвований, и каждый дает, сколько может. Собранные средства идут на аренду помещения, чай и т. д.',
  answer_9: 'AA ни с какой религиозной организацией не связано. Большинство членов АА считает, что они смогли покончить с алкоголизмом благодаря силе более могущественной, чем их сила воли. Однако каждый понимает под этой силой что-то свое. Одни понимают под ней Бога, другие — помощь групповых собраний, кто-то еще вообще ни во что подобное не верит. \n\nВ АА есть место для всех оттенков веры или неверия.',
  answer_10: 'И членов семьи, и близких друзей можно приводить только на открытые собрания. Более подробную информацию по этому вопросу можно получить у членов вашей местной группы АА.',
  answer_11: groupSchedule,
  service: '💬 «Я уделяю много времени другим, тем, кто нуждается и хочет исцелиться, рассказывая им о том, что узнал сам. Я делаю это по следующим четырем причинам:\n\n— Из чувства долга.\n— Потому, что это доставляет мне удовольствие.\n— Потому, что, делая это, я возвращаю свой долг тому, кто потратил время на то, чтобы передать мне эти знания.\n— Потому, что каждый раз, когда я это делаю, я как бы приобретаю дополнительную гарантию против собственного срыва»\n\n📚 Книга «Анонимные Алкоголики». Кошмар доктора Боба. стр. 162-172\n\n🧐 Нужно служение? Все очень просто! На собрании АА можно подойти к секретарю или ведущему и спросить, нужны ли служители данной группе АА.\n\n🤝 Также можно прийти на рабочее собрание группы и все узнать там.\n\n✅ Это работает!',
  step_11_am: step11Actions,
  step_11_pm: eveningReflection,
  relative: 'Как жить с алкоголиком?\n\nЕсли Вы задаетесь этим вопросом, значит что в Вашей жизни не всё так как хотелось бы.\n\nЕсли Вы попали на эту страницу, значит Вы уже пришли к пониманию того, что ни Ваш близкий человек, ни Вы не способны самостоятельно справиться с существующей проблемой.\n\nНам не понаслышке известны эти проблемы. Многие из нас были в таком же состоянии и смогли найти выход из похожей ситуации.\n\nЕсли Вы решили помочь своему близкому человеку, то приходите на наши открытые собрания Анонимных Алкоголиков. Вы увидите, что в жизни Вашего близкого человека многое может измениться и Вы сможете найти ответ на свой вопрос: как жить с алкоголиком?\n\nКогда вы не знаете, куда обратиться, если кто-то пьет слишком много, Семейные группы Ал-Анон, возможно, смогут вам помочь.',
  open_meeting: 'Что такое открытое собрание?\n\n' + 'Собрания Анонимных Алкоголиков проводятся для людей, страдающих алкогольной зависимостью. Соответственно присутствуют на таких закрытых собраниях только те люди, у которых есть проблемы с алкоголем. Это важное условие для поддержания комфортной атмосферы выздоровления, а главное - важный фактор анонимности.\n\n' +
    'Однако как быть, если на собрание хотят прийти те, у кого такой проблемы нет? Это могут быть родственники или близкие алкоголиков. Или любые другие люди, интересующиеся сообществом и его деятельностью. Для таких случаев в сообществе предусмотрены открытые собрания.\n\n' +
    'Каждая группа регулярно проводит открытые собрания. Туда может прийти каждый желающий. Собрания проходят в таком же формате, как и закрытые. Так же выбирается одна тема, касающяяся выздоровления, и участники делятся своим опытом, подходящим к этой теме.\n\n' +
    'Благодаря специально определенным датам открытого собрания, те члены сообщества, которые не хотят раскрывать свою анонимность, могут не приходить в этот день. А у тех, кто хочет понять как это происходит, есть возможность посетить живое собрание.\n\n' +
    'Если ваши близкие страдают от алкогольной зависимости или вам просто интересно узнать о сообществе, приходите на открытые собрания анонимных алкоголиков. Вас ждет вкусный чай с печеньками и рассказы о том, как зависимые люди справляются со своим недугом.',
  alanon: "Ал-Анон - это содружество родственников и друзей алкоголиков, которые делятся друг с другом своим опытом, силой и надеждой, чтобы решить общие проблемы.\n\nМы верим, что алкоголизм — это семейная болезнь и что перемена отношения к нему может способствовать выздоровлению.\n\nАл-Анон не связан с какой-либо сектой, вероисповеданием, политической группировкой, организацией или сообществом; не участвует в полемике по каким-либо вопросам, не выступает ни за, ни против чего бы то ни было. Членство в нем бесплатное. Ал-Анон — это организация, целиком существующая на добровольные пожертвования своих членов.\n\nУ Ал-Анона только одна цель — помочь семьям алкоголиков.\n\nГруппы для родственников алкоголиков. Приходите, мы вам рады.\n\nГруппа 'Росток'\nул. П.Лумумбы, д. 8, каб. 203\nВТ 18:00, СБ 15:00\nТел. 8 (952) 311-84-37\n\nГруппа 'Феникс'\nул. Гузовского, д. 14, ориентир - парикмахерская 'Ева'.\nЧТ 18.30, ВС 18.00\nТел. 8 (952) 027-00-87"
};



