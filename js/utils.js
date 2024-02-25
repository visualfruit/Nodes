function logObjectWithTypesAndValues(obj, prefix = '') {
    for (const key in obj) {
      const value = obj[key];
      const type = typeof value;
  
      if (type === 'object' && value !== null) {
        console.log(prefix + key + ":");
        logObjectWithTypesAndValues(value, prefix + '  ');
      } else {
        console.log(prefix + key + ": " + value + " (" + type + ")");
      }
    }
  }
