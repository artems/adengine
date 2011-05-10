var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("category", function() {
                    callback();
                });
            },
                
            function(callback) {
                app.mongo.collection("category", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {id: 1, parent_id: null, name: 'Авто и Мото'}
                  , {id: 2, parent_id: 1, name: 'Автострахование'}
                  , {id: 3, parent_id: 1, name: 'Клубы автовладельцев'}
                  , {id: 4, parent_id: 1, name: 'Мотоциклы'}
                  , {id: 5, parent_id: 1, name: 'Оборудование и запчасти'}
                  , {id: 6, parent_id: 1, name: 'Продажа / Покупка'}
                  , {id: 7, parent_id: 1, name: 'Услуги'}
                  , {id: 8, parent_id: null, name: 'Бизнес и Финансы'}
                  , {id: 9, parent_id: 8, name: 'Бухгалтерия'}
                  , {id: 10, parent_id: 8, name: 'Инвестиции'}
                  , {id: 11, parent_id: 8, name: 'Кредиты'}
                  , {id: 12, parent_id: 8, name: 'Право'}
                  , {id: 13, parent_id: 8, name: 'Промышленность'}
                  , {id: 14, parent_id: 8, name: 'Реклама, маркетинг и PR'}
                  , {id: 15, parent_id: 8, name: 'Страхование'}
                  , {id: 16, parent_id: 8, name: 'Телекоммуникации'}
                  , {id: 17, parent_id: null, name: 'Недвижимость'}
                  , {id: 18, parent_id: 17, name: 'Аренда'}
                  , {id: 19, parent_id: 17, name: 'Дом, интерьер'}
                  , {id: 20, parent_id: 17, name: 'Жилая недвижимость'}
                  , {id: 21, parent_id: 17, name: 'Коммерческая недвижимость'}
                  , {id: 22, parent_id: 17, name: 'Продажа / Покупка'}
                  , {id: 23, parent_id: 17, name: 'Строительство и ремонт'}
                  , {id: 24, parent_id: null, name: 'СМИ'}
                  , {id: 25, parent_id: 24, name: 'Деловая пресса'}
                  , {id: 26, parent_id: 24, name: 'Общеновостные ресурсы'}
                  , {id: 27, parent_id: 24, name: 'Развлекательная пресса'}
                  , {id: 28, parent_id: null, name: 'Женские ресурсы'}
                  , {id: 29, parent_id: 28, name: 'Буду мамой!'}
                  , {id: 30, parent_id: 28, name: 'Домашние питомцы'}
                  , {id: 31, parent_id: 28, name: 'Красота и здоровье'}
                  , {id: 32, parent_id: 28, name: 'Кулинария'}
                  , {id: 33, parent_id: 28, name: 'Мода и стиль'}
                  , {id: 34, parent_id: 28, name: 'Родители и дети'}
                  , {id: 35, parent_id: 28, name: 'Садоводство'}
                  , {id: 36, parent_id: 28, name: 'Свадьба и брак'}
                  , {id: 37, parent_id: null, name: 'ЛайфСтайл'}
                  , {id: 38, parent_id: 37, name: 'Афиша'}
                  , {id: 39, parent_id: 37, name: 'Погода'}
                  , {id: 40, parent_id: 37, name: 'Рестораны'}
                  , {id: 41, parent_id: 37, name: 'Хобби и увлечения'}
                  , {id: 42, parent_id: 37, name: 'Шоппинг'}
                  , {id: 43, parent_id: 37, name: 'Я - фотограф!'}
                  , {id: 44, parent_id: null, name: 'ХайТек'}
                  , {id: 45, parent_id: 44, name: 'Аудио и Видео'}
                  , {id: 46, parent_id: 44, name: 'Гаджеты'}
                  , {id: 47, parent_id: 44, name: 'Железо'}
                  , {id: 48, parent_id: 44, name: 'Компьютеры'}
                  , {id: 49, parent_id: 44, name: 'Мир Apple'}
                  , {id: 50, parent_id: 44, name: 'Мобильная связь'}
                  , {id: 51, parent_id: 44, name: 'Техника'}
                  , {id: 52, parent_id: 44, name: 'Фототехника'}
                  , {id: 53, parent_id: 44, name: 'Электроника'}
                  , {id: 54, parent_id: null, name: 'Спорт'}
                  , {id: 55, parent_id: 54, name: 'Активный и экстремальный спорт'}
                  , {id: 56, parent_id: 54, name: 'Новости спорта'}
                  , {id: 57, parent_id: 54, name: 'Фан - клубы'}
                  , {id: 58, parent_id: 54, name: 'Фитнес'}
                  , {id: 59, parent_id: 54, name: 'Футбол!'}
                  , {id: 60, parent_id: 54, name: 'Товары и услуги'}
                  , {id: 61, parent_id: null, name: 'Путешествия'}
                  , {id: 62, parent_id: 61, name: 'Страны'}
                  , {id: 63, parent_id: 61, name: 'Советы бывалых, отзывы'}
                  , {id: 64, parent_id: 61, name: 'Туры и отели'}
                  , {id: 65, parent_id: null, name: 'Образование'}
                  , {id: 66, parent_id: 65, name: 'Образовательные ресурсы'}
                  , {id: 67, parent_id: 65, name: 'Рефераты, домашние задания'}
                  , {id: 68, parent_id: 65, name: 'Словари, переводчики, справочники'}
                  , {id: 69, parent_id: null, name: 'Отдых и развлечения'}
                  , {id: 70, parent_id: 70, name: 'Видео'}
                  , {id: 71, parent_id: 70, name: 'Игры'}
                  , {id: 72, parent_id: 70, name: 'Кино'}
                  , {id: 73, parent_id: 70, name: 'Музыка'}
                  , {id: 74, parent_id: 70, name: 'Развлекательные новости'}
                  , {id: 75, parent_id: 70, name: 'Фото'}
                  , {id: 76, parent_id: null, name: 'Карьера'}
                  , {id: 77, parent_id: 76, name: 'Вакансии'}
                  , {id: 78, parent_id: 76, name: 'Резюме'}
                  , {id: 79, parent_id: 76, name: 'Профессиональные сообщества и социальные сети'}
                  , {id: 80, parent_id: 76, name: 'Фриланс'}
                  , {id: 81, parent_id: null, name: 'Справочники и классификаторы'}
                  , {id: 82, parent_id: null, name: 'Блоги, социальные сети, сообщества'}
                  , {id: 83, parent_id: null, name: 'Разное'}
                  , {id: 84, parent_id: null, name: 'Регионы'}
                  , {id: 85, parent_id: 1, name: 'Тест-Драйв'}
                  , {id: 86, parent_id: 8, name: 'Обзоры рынков'}
                  , {id: 87, parent_id: 84, name: 'Все регионы'}                  
                ], callback);
            }
        ], callback)
    });
};