if (Bal === undefined) {
    const MemberData = {
        id: `${target.id}`,
        USD: "0"
      };
      const mergedObject = {
        ...object,
        ...MemberData
      };
      store.add(mergedObject, function(err) {
        if (err) throw err;
    });
}