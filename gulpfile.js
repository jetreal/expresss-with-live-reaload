var gulp           = require('gulp'),
  autoprefixer 		 = require('gulp-autoprefixer'),
	sass         		 = require('gulp-sass')(require('sass')),
  cssnano      		 = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       		 = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	concat       		 = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	del          		 = require('del') // Подключаем библиотеку для удаления фа


	const { series } = require('gulp');  // новый синтаксис
	const { parallel } = require('gulp'); // новый синтаксис галп 4 


  gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.sass', gulp.parallel('sass')); // Наблюдение за sass файлами в папке sass      // Наблюдение за JS файлами в папке js
  });

  // sass and css tasks
gulp.task('sass', function () { // Создаем таск Sass
	return gulp.src('src/sass/**/*.sass') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('public/stylesheets')) // Выгружаем результата в папку app/css
});

exports.watch = parallel('watch');