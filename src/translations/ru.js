import {
    webpackConfigClient,
    webpackConfigServer,
    graphQlAuthResolvers,
    reactSSRServer
} from './links'
import { getAge } from './helpers'

const AGE = getAge('September 8, 1992 00:00:00')

export default {
    OK: 'Ок',
    NEXT: 'Далее',
    REBUILDING: 'Перестроение интерфейса',
    PROLOGUE: 'Пролог',
    PROLOGUE_DESCRIPTION: `
        Привет! Меня зовут Кирилл, мне ${AGE} лет, и у меня тут интерактивное резюме
        на позицию Junior Frontend Developer. Если у Вас есть 5-7 свободных
        минут, то это очень кстати.
    `,
    ABOUT: 'Обо мне',
    PREHISTORY: 'Предыстория',
    PREHISTORY_STORY: `
        В детстве я обладал суперспособностью создавать любые несуществовавшие
        до меня объекты: межзвёздные шаттлы, космические станции, целые города.
        Единственным, что могло мне помешать, было ограниченное количество
        деталек LEGO.
                                        |
        Вы правильно поняли: это история о том, как программирование стало для
        меня конструктором LEGO с бесконечным количеством деталек любой формы,
        размера и цвета :)
                                        |
        Я окунулся в веб во времена, когда табличная вёрстка была обычным
        делом, тэг &lt;font&gt; не выглядел диким анахронизмом, а jQuery была
        основой почти любого сайта. Хотя, кажется, с последним пунктом всё
        стабильно..
                                        |
        Первым значительным учебником в моих руках был самоучитель Мэтта
        Зандстры по PHP5. Denwer (а после - стандартная связка PHP + MySQL +
        Apache) засорил мой компьютер учебными проектами (если Вы позволите их
        так назвать).
                                        |
        Насилие над PHP на дилетантском уровне продолжалось до момента появления
        у меня семисотстраничного учебника по AJAX (сейчас он вызывает улыбку).
        Таким образом, с костылей вроде &lt;iframe&gt; и &lt;img&gt; для
        имитации AJAX-запросов началось моё знакомство с миром JavaScript,
        однако, возможность сделать одно и то же десятком способов только
        подстегнула интерес.
                                        |
        С тех пор было много книг и статей. Спустя годы я обрёл Node.js и
        глубоко выдохнул: эпоха конструирования велосипедов окончилась,
        освободив дорогу изучению библиотек и фреймворков.
                                        |
        Остаётся только добавить, предвосхищая возможный вопрос, почему я до сих
        пор даже не джуниор: программирование для меня всегда было 
        исключительно увлечением, отдыхом и творчеством. Но это уже
        совсем другая история.
    `,
    EDUCATION_AND_EXPERIENCE: 'Образование и опыт работы',
    EDUCATION_AND_EXPERIENCE_STORY: `
        Объяснить, почему к ${AGE} годам я не имею высшего образования и
        какого-либо опыта коммерческой разработки... Пока большинство эйчаров
        закрывают текущую вкладку браузера, попробую.
                                        |
        Так получилось, что только сейчас в моих ближайших планах - заочное
        высшее образование. Не принимать концепцию "корочек" - благородное дело,
        но не всегда по факту оправданное.
                                        |
        Все люди разные, по-разному понимают себя, чего они хотят и что им
        действительно нужно. В этом, по сути, и весь ответ. Несмотря на подобный
        инфантилизм, я всегда считал самообразование крайне важной составляющей
        процесса развития личности и никогда не останавливался в этом
        направлении.
                                        |
        Я никогда не задумывался заниматься программированием профессионально,
        аргументируя для себя выбор простых примитивных работ нежеланием
        превращать одно из любимых занятий и хобби в будничную рутину.
                                        |
        Но думаю, здесь всё проще: мозг склонен к самооправданию для экономии
        ресурсов, и в глубине я просто боялся признаться себе в недостатке
        знаний и навыков.
                                        |
        Времена поменялись, и моё ощущение также. Есть в этой погоне за давно
        ушедшим поездом своя авантюрная романтика; во всяком случае, пока мне
        никто не объяснил, почему когда-то бывает слишком поздно.
    `,
    BLACK_THOUGHTS: [
        'Промзона "Светлое Будущее"',
        'Дом Престарелых "Трясущийся Карась"',
        'Биржа Труда "Где Тебя Носит?!"',
        `Театр Драмы. Трагикомедия "${AGE}-летний Джуниор"`,
        'Церковь Саентологии "Надежда Есть"'
    ],
    NON_COMMERCIAL_EXPERIENCE: 'Некоммерческий опыт',
    NON_COMMERCIAL_EXPERIENCE_INTRO: `
        Несмотря на полное отсутствие опыта коммерческой разработки, в разные
        периоды жизни я писал для себя массу всего:
    `,
    NON_COMMERCIAL_EXPERIENCE_LIST: `
        Сайты на PHP + MySQL
        | Приложения на VanillaJS
        | Приложения на React + Redux
        | MERN SPA + SSR
        | Web Extensions
        | Ботов для браузерных игр
    `,
    NON_COMMERCIAL_EXPERIENCE_OUTRO: `
        Некоторые примеры кода будут в разделе Скиллы.
    `,
    SKILLS: 'Скиллы',
    SKILLS_GREETING: `
        Нажмите на интересующую технологию для просмотра подробной информации
    `,
    REASONS: 'Почему я',
    REASONS_YOU: 'Вы',
    REASONS_YOU_CONTENT: `
        {li:Ищете человека, вовлечённого в веб-разработку, постоянно
            развивающегося и углубляющего свои знания}
        {li:Ставите в приоритет знания и желание профессионального роста над
            дипломами и коммерческим опытом}
        {li:Готовы взять на позицию джуниора человека, который, вероятно, старше
            ваших синьоров :)}
    `,
    REASONS_I: 'Я',
    REASONS_I_CONTENT: `
        {li:Привык программировать подолгу, готов к любому объёму работы, в т.ч.
            сверхурочно}
        {li:Максимально неконфликтный человек; спокойно воспринимаю даже
            жёсткую, но объективную критику}
        {li:Активно самообучаюсь. Не задаю глупых вопросов и не стесняюсь
            задавать неглупые}
        {li:Не имею вредных привычек}
    `,
    EPILOGUE: 'Эпилог',
    EPILOGUE_THATS_ALL: 'Такие дела.',
    EPILOGUE_MESSAGE: `
        {p:Я не очень разбираюсь в том, как должны выглядеть резюме джуниоров,
            но, надеюсь, мне удалось в ненапрягающей форме озвучить некоторые
            важные для меня моменты.}
        {p:И спасибо за потраченное время!}
    `,
    EPILOGUE_SOURCE: 'Исходный код этого резюме',
    EPILOGUE_SOCIAL: 'Немного хорошей музыки',
    TECH_FRONTEND: 'Фронтенд',
    TECH_BACKEND: 'Бэкенд',
    TECH_OTHER: 'Прочее',
    TECH_TITLE_OOP: 'ООП',
    TECH_TITLE_LAY: 'CSS вёрстка',
    TECH_JS: `
        {p:Знаю лучше, чем любой другой язык/технологию. Поглядываю за
            стандартами ECMAScript и использую новые возможности, как только
            появляется поддержка в Babel. Хорошо понимаю такие вещи, как:}
        {li:Event loop}
        {li:Prototype chain, контекст выполнения, наследованиe, замыкания и
            т.д.}
        {li:Асинхронность, итераторы, любые встроенные объекты и методы}
        {p:Это резюме написано на  чистом JavaScript без каких-либо
            зависимостей.}
    `,
    TECH_PSD: `
        {p:Знаю на уровне нарезки изображений (или SVG) из PSD макетов. Хвала
            небесам, он не нужен ни для чего более во фронтенд-разработке.}
        {li:Использую Zeplin для более комфортной вёрстки}
    `,
    TECH_DOM: `
        {li:Свободно ориентируюсь в DOM без каких-либо библиотек}
        {li:Понимаю отличия HTMLCollection от JavaScript-массива :)}
        {li:Быстро разберусь с любыми DOM/CSSOM объектами}
    `,
    TECH_CSS: `
        {p:Делал скругленные уголки в IE ещё с CSS3PIE :)}
        {li:Использую большинство возможностей CSS: любые селекторы,
            псевдоэлементы, псевдоклассы, media queries, animation, transitions,
            transforms, css-переменные и т.д.}
    `,
    TECH_LAY: `
        {li:Умею создавать адаптивную вёрстку любой сложности, начиная с
            табличной вёрстки для email, до flexbox}
        {li:Рассуждаю в парадигме Mobile First}
        {li:Использую тэги по назначению для повышения семантичности}
        {li:Верстаю кроссбраузерно, если это необходимо. Это резюме, например,
            не будет работать даже в IE11, так как зло должно быть искоренено}
        {li:Использую BEM-методологию для именования CSS-классов}
    `,
    TECH_REACT: `
        {p:Часто и активно использую. Понимаю механизм работы, жизненный цикл
            компонентов, хуки.}
        {li:Работал с react-loadable и loadable-components, react-router,
            react-helmet}
        {li:Понимаю, как работает серверный рендеринг в связке с Redux и code
            splitting. <a href="${reactSSRServer}" target="_blank">Пример
            использования</a> redux-saga + loadable components с SSR}
    `,
    TECH_REDUX: `
        {p:Использую только в связке с React.}
        {li:Знаю принципы, механизм работы. Понимаю, что такое редьюсеры,
            экшены, селекторы и т.д. Использую также с хуками}
        {li:Работал с redux-thunk и redux-saga}
    `,
    TECH_WEXT: `
        {p:Понимаю, как работают браузерные расширения. Из чего состоит
            manifest, для чего нужны background и content скрипты и т.д.}
        {p:Достаточно много возился с расширениями; оказались очень удобны в
            качестве интерфейса для бота (для браузерной онлайн игры), так как
            этот подход обеспечивал пониженную вероятность его обнаружения :)}
        {li:Знаком с Web Extensions API и отличиями от расширений для Chrome}
        {li:Использую web-ext для разработки}
    `,
    TECH_WANIM: `
        {p:Изначально в этом резюме я использовал именно Web Animations API
            из-за гибкости и производительности, но полифилл на старом iOS
            Safari имеет некоторую утечку, наличие которой очень усложняло
            процес создания резюме, но искать которую я, конечно же, не стал.
            Понимаю:}
        {li:Web Animations API}
        {li:Особенности браузерной анимации, вещи вроде reflow/repaint,
            как облегчить браузеру отрисовку анимации}
        {li:Как делать анимацию на чистом JavaScript (и почему лучше не
            делать), CSS-animation, использование CSS transition + JavaScript
            (как в этом резюме)}
    `,
    TECH_SVG: `
        {p:Плотно не работал с библиотеками вроде D3, но понимаю, на что они
            способны и знаю SVG на уровне, достаточном для быстрого старта.}
        {p:В этом резюме все изображения (кроме иконок гитхаба и вк) написаны на
            SVG вручную кодом, т.к. я не ни разу дизайнер и в моём случае так
            сделать оказалось проще и быстрее.}
    `,
    TECH_SASS: `
        {p:Имею опыт работы с LESS, но активно использую SASS. Впрочем, CSS
            препроцессоры крайне похожи и по синтаксису, и по функционалу.}
        {li:Знаю на уровне миксинов, наследования, функций, циклов}
    `,
    TECH_UIX: `
        Добавил сюда этот пункт не потому, что очень верю в свои способности,
        а из-за пристрастия к придумыванию интерфейсов. Стараюсь, чтобы
        они были понятны и удобны с первого пользовательского опыта.
    `,
    TECH_JQRY: `
        Немерено лет jQuery пророчат забвение, тем не менее. Понимаю, как она
        работает и как написать библиотеку со схожим интерфейсом.
    `,
    TECH_NODE: `
        {p:Понимаю, как работает, некоторые особенности. Знаком со встроенными
            объектами и модулями. В остальном - обычный JavaScript, который знаю
            довольно неплохо.}
        {li:Использую Express в качестве сервера}
    `,
    TECH_GRQL: `
        {p:Понимаю основные принципы, знаю на базовом уровне.}
        {li:Использую express-graphql}
        {li:<a href="${graphQlAuthResolvers}" target="_blank">Resolvers</a> для
            простой аутентификации пользователей}
    `,
    TECH_REST: `
        Понимаю требования к архитектуре, знаю, как пишется RESTful API с
        использованием Express.
    `,
    TECH_HTTP: `
        {p:Знаю на уровне заголовков, методов, структуры запросов.}
        {li:Использую Postman для отладки}
    `,
    TECH_SQL: `
        {p:Знаю на уровне JOIN и GROUP, понимаю, что такое индексы,
            транзакции. Понимаю различия между реляционными и нереляционными
            СУБД и разницу в построении в них архитектуры.}
        {li:Работал с MySQL и MongoDB (ODM Mongoose)}
    `,
    TECH_JWT: `
        Знаком со стандартом, понимаю, как работает. Работал с библиотекой
        Jsonwebtoken для написания аутентификации пользователей (вместе с Redis
        для контроля ещё валидных токенов после логаута).
    `,
    TECH_BUND: `
        {p:Часто использую Webpack. Пара конфигов для примера: для 
            <a href="${ webpackConfigClient}" target="_blank">клиентской</a> и
            <a href="${webpackConfigServer}" target="_blank">серверной</a>
            частей сайта на React + SSR}
        {p:Знаю Gulp на базовом уровне и использую в основном для сборки SASS}
    `,
    TECH_GIT: `
        Честно говоря, сложно представить процесс даже любительской разработки
        без VCS. Использую Git через командную строку, но, начиная со слияния
        веток, что-то делаю только с использованием документации, т.к. не в
        командной разработке что-то сложное необходимо не часто.
    `,
    TECH_OOP: `
        {p:Когда-то интересовался функциональным программированием, вещами вроде
            карринга, вездесущей рекурсии и pure-functions (и библиотеками
            вроде Ramda), но считаю объектно-ориентированный подход к
            программированию предпочтительным даже для языка вроде JavaScript.}
        {li:Изучал всё, что находил, касательно алгоритмов, паттернов
            проектирования, архитектуры и т.д.}
        {li:Знаком с принципами SOLID. Сложно применять их к JavaScript, но тем
            не менее}
        {li:Знаком с шаблонами GRASP, стараюсь использовать}
    `,
    TECH_ENG: `
        Уровень - Intermediate. Достаточно свободно читаю техническую
        литературу и документацию.
    `
}