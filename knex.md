Initialize project:
* npm init -y

Install knex and pg locally:
* npm i pg knex

Install knex and pg globally:
* https://nodejs.org/en/blog/npm/npm-1-0-global-vs-local-installation/#which-to-choose
* npm i -g pg knex

Create database:
-e output command, knex_demo is the name of our database
* createdb -e knex_demo

View a list of commands from knex:
* knex

Generate knexfile.js:
* knex init

Generate migration file:
* knex migrate:make <name-of-migration-file>

Migrate pending migrations:
* knex migrate:latest

Rollback previous migration:
* knex migrate:rollback

View pending migrations:
* knex migrate:list

Run knex query file:
* node <path-to-file>

Install devDependencies:
* npm i -D faker cowsay

Generate seed file:
knex seed:make 000GeneratePosts

Run seeds:
knex seed:run