function initLogger(name = '') {
  return {
    info(data) {
      const level = 'INFO';
      const display = this.__display.bind(this, level);
      display(data);
    },
    debug() {},
    error() {},

    __display(type, messages) {
      // if (!config.debugEnabled) return;
      const header = `/‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾${name} ${type}‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾`;
      const footer = `\\___________________${name} ${type} END___________________`;

      console.log(header);

      if (Array.isArray(messages)) {
        console.log(...messages.map((m, i) => ((typeof m === 'string' && i) && `\n${m}`) || m));
      } else {
        console.log(messages);
      }

      console.log(footer);
    },
  };
}
export default initLogger;
