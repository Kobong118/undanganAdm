function interopRequireDefault(mod) {
    return mod && mod.__esModule ? mod.default : mod;
  }
  
  const Alpine = interopRequireDefault(require('alpinejs'));
  const intersect = interopRequireDefault(require('@alpinejs/intersect'));
  
  Alpine.plugin(intersect);
  
  window.Alpine = Alpine;
  Alpine.start();



       