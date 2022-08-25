module.exports.home = function(req, res){
    return res.render('home',{});
}
module.exports.about = function(req,res){
    return res.render('about');
}