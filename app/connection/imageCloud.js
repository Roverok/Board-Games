module.exports = function(cloudinary){
  cloudinary.config({
    cloud_name: 'dude-love',
    api_key: '377159495627157',
    api_secret: 'cmlIwyq0TaYQsTN0GNPHKvNxNuw'
  });

  /*cloudinary.uploader.upload("./public/images/avatars/avatar-1.png", function(result) {
    console.log(result)
  },{use_filename:true,unique_filename:false,folder:'avatars'});
*/
}