var http = require('http');
var goodGuy = require('good-guy-http')()

http.createServer((req, res) => {
  console.log(`called ${req.url}`)
  console.log(`called headers ${JSON.stringify(req.headers)}`)
  if(req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation'){
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', async () => {
      body = Buffer.concat(body).toString();
      // at this point, `body` has the entire request body stored in it as a string
      console.log(`called body ${body}`)
      var pBody = JSON.parse(body)
      await goodGuy(pBody.SubscribeURL)
      res.end('hell0')
    })
  } else {
    console.log('Notification')
  }
}).listen(8080, err => { 
  if(err){
    console.log('something bad happened',err)
  }
  console.log('Server started')
}
)
