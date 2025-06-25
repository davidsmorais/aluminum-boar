import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const phasermsg = () => {
	return {
		name: "phasermsg",
		buildStart() {
			process.stdout.write(`Building for production...\n`);
		},
		buildEnd() {
			const line = "---------------------------------------------------------";
			const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
			process.stdout.write(`${line}\n${msg}\n${line}\n`);

			process.stdout.write(`✨ Done ✨\n`);
		},
	};
};

export default defineConfig({
	base: "./",
	plugins: [react(), phasermsg()],
	logLevel: "warning",
	resolve: {
		alias: {
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
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					phaser: ["phaser"],
				},
			},
		},
		minify: "terser",
		terserOptions: {
			compress: {
				passes: 2,
			},
			mangle: true,
			format: {
				comments: false,
			},
		},
	},
});
