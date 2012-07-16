var fs = require('fs'),
    compile = require('./compile')
    cmd = require('./cmd');

var dir = cmd.dir;
var out_dir = cmd.out || dir;
var watched_files = {};

function do_compile(file, current_dir, dir, out_dir){
    console.log('compile: ' + dir + file);
    fs.writeFile((out_dir + file).replace(/\.xml/, '.js'),  ';(function(x){if(!x.fest)x.fest={};x.fest["'+current_dir+"/"+file.replace(/\.xml$/, '')+'"]='+compile(dir + file, '', '')+'})(this);', 'utf8');
    return file;
}

function findfiles(dir, current_dir, out_dir){
    fs.readdir(dir, function(err, files){
        files.filter(function(file){return file.indexOf('.xml') > 0;})
             .forEach(function(file){
                 console.log('watch: ' + file);
                 do_compile(file, current_dir, dir, out_dir);
             });
        files.filter(function(file){ return fs.statSync(dir + file).isDirectory() })
             .forEach(function(file){
                 console.log('watch directory: ' + dir + file);
                 findfiles(dir + file + '/', file, out_dir + file + '/');
             });
    });
}

findfiles(dir, dir, out_dir);
