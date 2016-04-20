
/*
 * List of all global functions.
 */
 
//function to require local modules
global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}