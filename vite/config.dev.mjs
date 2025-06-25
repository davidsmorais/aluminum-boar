import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	plugins: [react()],
	server: {
		port: 8080,
	},
	resolve: {
		alias: {
			// Manually map the alias if needed
			public: "/public",
			Assets: "/src/types/assets.ts",
			Types: "/src/game/types.ts",
			Game: "/src/game",
			Characters: "/src/game/characters",
			Scenes: "/src/game/scenes",
			Procs: "/src/game/procs",
			Weapons: "/src/game/procs/weapons",
			Src: "/src",
		},
	},
});
