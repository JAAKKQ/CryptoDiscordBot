var store = require('data-storage-system')('./data/member');

store.add(id, name, value, function(err, object){
  if(err) throw err;
});
store.load(id, name, function(err, object){
  if(err) throw err;
});