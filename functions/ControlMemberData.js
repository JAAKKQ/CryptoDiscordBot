var store = require('json-fs-store')('./data/member');

store.load(`${target.id}`, function(err, object){
    if(err) throw err;
    const target = interaction.options.getUser('user') ?? interaction.user;
      const MemberData = {
        id: `${target.id}`,
      };
      const mergedObject = {
        ...object,
        ...MemberData
      };
      store.add(mergedObject, function(err) {
        if (err) throw err;
      });
  });