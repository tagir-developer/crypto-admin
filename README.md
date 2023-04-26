# О проекте



## Как запустить проект

Проект запускаем командой `npm start` из корневой директории

ВАЖНО: (Проект использует json-server для эмуляции сервера, поэтому добавление и изменение элементов работает не совсем правильно)

## Особенности проекта

1) Проект не содержит сложной логики и больше направлен для демонстрацию актуального стиля написания кода. Файловая структура - облегченная вариация модульной архитектуры. В папке pages хранятся страницы (по сути модули проекта), а в папке components общие компоненты. Вспомогательные компоненты уникальные для модуля находятся в папке с основным модулем (страницей)

2) Добавлен неиспользуемый код для настройки авторизации с помошью jwt токенов, пока отключен, так как нет полноценного сервера с авторизацией

3) В качестве хранилища данных используется Redux toolkit + RTK Query для получения данных с сервера с возможностью кэширования. Однако для простых состояний, типа модальных окон, используются хуки, чтобы не перегружать Redux ненужным состоянием

4) Для ускорения разработки используется библиотека Ant Design, так как она функциональнее Material UI в плане таблиц, типизирована и удобна в использовании.



## Дополнительно

Если хотите посмотреть пример написания более сложной бизнес логики, то советую ознакомиться с этим (ссылка ниже) урезанным проектом (большинство файлов удалено, так как планирую коммерческий запуск этого сервиса в будущем)

[Github репозиторий сложного проекта](https://github.com/tagir-developer/constructor-demo)
