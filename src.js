var webshot = require('./lib/webshot');

webshot('adamrobins.com', '/home/user/Desktop/imgloaderphp/img/img.png', function(err) {
  if (err) return console.log(err);
  console.log('OK');
});

