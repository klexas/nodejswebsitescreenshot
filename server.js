  var http = require("http"),
  url = require("url"),
  fs = require("fs"),
  webshot = require('./lib/webshot')
  port = process.argv[2] || 8888;

  //Lets get started
  http.createServer(function(req, res) {

    //Create image function
    function createImg(url){
    //regex on the url to remove the .com etc
    var newurl = url.replace(/\.[^/.]+$/, "").substring(1),
    urlToParse = url.substring(1),    
    options = {
      screenSize: {
        width: 1280,
        height: 720
      },
      shotSize: {
        width: 'all',
        height: 'all'
      }
    };

    //try to create the screenshot of the website, saving it as the website name + .png 
    //TODO: png is 'lossless' therefore can be quite large a file, should look to take in params for format. 
    webshot(urlToParse, newurl + '.png', options, function(err) {
     if(err) // early out. 
     {
      //If we have an error, without collapsing the server, we will just create a fake answer to alleviate the later.
      //TODO: Handle this better. 
      console.log(err);
      var fakeURL = {
        url: "googe.ie"
      };
      processImage(fakeURL, res);
    }
    else{
      console.log('Finished creating the image.. Now sending sending back to requester. ');
      //we try to process the image only after we have the image created
      //otherwise later we will try to real the file before we have finished creating it. 
      processImage(req, res);
    }
  })
  }

  //This will read the created file and send it back to the requester. 
  //If calling this manually, ensure you pass in a valid object - otherwise you will crap out server. 
  //TODO: Make sure it doesnt just blindly request an input. Also PNG needs to be enum noted as mentioned earlier
  function processImage(req, res){
    fs.readFile(req.url.replace(/\.[^/.]+$/, "").substring(1) +'.png', function(err, data) {
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(data); 
    });
  }
  //just ensure we actually have something. 
  //TODO: Make sure the request is in a URL structure - DANGERZONE
  if(req != "")
  {
    createImg(req.url);
  }
}).listen(parseInt(port, 10));

//TODO: Arbitrary but need to add a debug flag to enable more console logging. 
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");  