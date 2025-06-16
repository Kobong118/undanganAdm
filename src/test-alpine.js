import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'

console.log('typeof Alpine.plugin:', typeof Alpine.plugin)         // harus "function"
console.log('typeof intersect plugin:', typeof intersect)          // harus "function"

Alpine.plugin(intersect)
console.log('✅ intersect plugin berhasil didaftarkan')
