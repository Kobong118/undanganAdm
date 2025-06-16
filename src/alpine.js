import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
import intersect from "@alpinejs/intersect"; // gunakan default import ✅

Alpine.plugin(persist);
Alpine.plugin(intersect);

window.Alpine = Alpine;
Alpine.start();
