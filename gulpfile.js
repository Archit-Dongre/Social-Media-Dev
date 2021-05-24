const gulp = require("gulp");

//for css minifying
const sass =  require("gulp-sass");
const cssnano = require("gulp-cssnano"); 

//for js minifying
const uglify = require("gulp-uglify");

//for image minifying

const imagemin = require("gulp-imagemin");

//for manifest files (docs with hash code in their name)
const rev = require("gulp-rev");

const del = require("del");


gulp.task("css" , function(){
    console.log("Minifying css....");
    gulp.src("./assets/sass/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets/css"))

    return gulp.src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    //manifest file 
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
})

gulp.task("js" , function(){
    return gulp.src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    //manifest file 
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
})

gulp.task("image",function(done){
    gulp.src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(rev.manifest({
        cwd:"public",
        merge:true
    }))
    .pipe(gulp.dest("./public/assets"));
    done();
})

gulp.task('clean:assets' , function(done){
    del.sync('./public/assets');
    done();
})

gulp.task('build' ,gulp.series("clean:assets",'css','js','image') ,function(done){
    console.log('Building assets...');
    done();
})