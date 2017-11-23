var Flickr = require('flickr-sdk');


/**
 * Flickr Adapter 
 * @class
 */
class Adapter{
  constructor(client){
    this.client = client;
    this.options = {
      key           : client.options.clientKey,
      secret        : client.options.clientSecret,
      accessToken   : client.options.accessToken,
      accessSecret   : client.options.accessSecret
    }

  }

  post(post){
    return new Promise((resolve,reject)=>{
  
      if(!post.file)
        throw new Error("Uploads to Flickr must contain a file");

      let oauth = Flickr.OAuth.createPlugin(
          this.options.key,
          this.options.secret,
          this.options.accessToken,
          this.options.accessSecret
      );

      var upload = new Flickr.Upload(
        oauth, 
        post.file.path, 
        {
          title: post.title,
          description: post.description,
          is_public: (post.private == true ? 0 : 1)
        }
      );

      upload.then(resp => {
        let id = resp.body.photoid._content;
        resolve({id: id, url: createLink(id)})
        // let flickr = new Flickr(oauth);
        // flickr.photos.getInfo({
        //   photo_id:id
        // }).then(res =>{
        //   console.log('image info', res.body.photo.urls);  
        //    resolve({resp:res.body.photo, base: base58_encode(parseInt(id))})
        // }).catch(reject);
        // console.log('yay!', resp.body);
       
      }).catch(function (err) {
        console.error('bonk', err);
        reject(err);
      });
  
    })
  }

}

function base58_encode( enc ){ 
  var alphabet =  '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  base = alphabet.length;
  if(typeof enc!=='number' || enc !== parseInt(enc))
      throw '"encode" only accepts integers.';
  var encoded = '';
  while(enc) {
      var remainder = enc % base;
      enc = Math.floor(enc / base);
      encoded = alphabet[remainder].toString() + encoded;        
  }
  return encoded;
}

function createLink(fileId){
  return "https://flic.kr/p/"+base58_encode(parseInt(fileId)) 
}

module.exports = Adapter;



