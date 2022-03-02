var store = require('json-fs-store')('./data/member');

store.load(`${target.id}`, "USD", function(err, object, Name){
  if(err) throw err;
  });
store.add(`${target.id}`, "USD", "1", function(err, object, Name){
  if(err) throw err;
  });