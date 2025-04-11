const shell = require("shelljs");
const fs = require("fs");
const camelCase = require("camelcase");

const ASSET_CLASS_FILE = "src/types/assets.ts";
const ASSET_TYPE_EXTENSIONS = {
	audio: ["flac", "mp3", "ogg", "wav", "webm"],
	image: ["gif", "jpg", "jpeg", "png", "webp"],
	font: ["eot", "otf", "svg", "ttf", "woff", "woff2"],
	bitmapFont: ["xml", "fnt"],
	json: ["json"],
	xml: ["xml"],
	text: ["txt"],
	script: ["js"],
	shader: ["frag"],
};

function toPascalCase(str) {
	return camelCase.default(str, { pascalCase: true });
}

/**
 * Get asset filename and extensions
 *
 * @returns {
 *   name: [ 'ext1', 'ext2', ... ]
 * }
 */
function findAssetTypeList(files) {
	const assets = {};
	files.forEach((fileName) => {
		const fileNameParts = fileName.split(".");
		const ext = fileNameParts.pop();
		const name = fileNameParts.join();
		assets[name] = (assets[name] || []).concat(ext);
	});
	return assets;
}

const findExtension = (haystack, typeExts) =>
	typeExts.some((v) => haystack.indexOf(v) >= 0);

/**
 * Decide asset type from file name and extensions
 *
 * @param {string} name file name
 * @param {Array<string>} exts file extensions
 * @results asset type by string
 */
function decideAssetType(name, exts) {
	const type = {
		image: findExtension(exts, ASSET_TYPE_EXTENSIONS.image),
		audio: findExtension(exts, ASSET_TYPE_EXTENSIONS.audio),
		font: findExtension(exts, ASSET_TYPE_EXTENSIONS.font),
		bitmapfont: findExtension(exts, ASSET_TYPE_EXTENSIONS.bitmapFont),
		json: findExtension(exts, ASSET_TYPE_EXTENSIONS.json),
		xml: findExtension(exts, ASSET_TYPE_EXTENSIONS.xml),
		text: findExtension(exts, ASSET_TYPE_EXTENSIONS.text),
		script: findExtension(exts, ASSET_TYPE_EXTENSIONS.script),
		shader: findExtension(exts, ASSET_TYPE_EXTENSIONS.shader),
	};

	if (type.bitmapfont) {
		type.bitmapfont =
			exts.findIndex(
				(ext) => shell.grep(/^[\s\S]*?<font>/g, `${name}.${ext}`).length > 1,
			) >= 0;
	}
	if (type.bitmapfont && type.image) {
		return "bitmapfont";
	}
	if (type.audio && type.json) {
		return "audiosprites";
	}
	if (type.image) {
		if (type.json || type.xml) {
			return "atlas";
		} else if (name.match(/\[(-?[0-9],?)*]/)) {
			return "spritesheet";
		}
		return "image";
	}
	return Object.keys(type).find((key) => type[key]) || "misc";
}

function generateAssetOptionsSpriteSheet(assetName, _extensions) {
	const prop = assetName.replace("[", "").replace("]", "").split(",");
	if (prop.length < 2 || prop.length > 5) {
		console.error(
			`Invalid number of Spritesheet properties provided for '${i}'. Must have between 2 and 5; [frameWidth, frameHeight, frameMax, margin, spacing] frameWidth and frameHeight are required`,
		);
	}

	return {
		options: [
			{ name: "FrameWidth", value: parseInt(prop[0] ? prop[0] : -1) },
			{ name: "FrameHeight", value: parseInt(prop[1] ? prop[1] : -1) },
			{ name: "FrameMax", value: parseInt(prop[2] ? prop[2] : -1) },
			{ name: "Margin", value: parseInt(prop[3] ? prop[3] : -1) },
			{ name: "Spacing", value: parseInt(prop[4] ? prop[4] : -1) },
		],
	};
}

function generateAssetOptionsAudioSprite(assetName, extensions) {
	const audioSprite = [];

	for (const extName of extensions) {
		const dataFile = `${assetName}.${extName}`;
		if (findExtension([extName], ASSET_TYPE_EXTENSIONS.json)) {
			try {
				const json = JSON.parse(fs.readFileSync(dataFile, "ascii"));
				for (const key of Object.keys(json["spritemap"])) {
					audioSprite.push({ name: toPascalCase(key), value: key });
				}
			} catch (err) {
				console.log(`Atlas Data File Error: ${err}`);
			}
		}
	}

	return {
		enum: {
			type: "Sprites",
			name: toPascalCase(assetName.split("/")),
			values: audioSprite,
		},
	};
}

function generateAssetOptionsCustomWebFont(assetName, _extensions) {
	let family = "";

	const dataFile = `${assetName}.css`;
	try {
		const css = fs.readFileSync(dataFile, "ascii");
		family = /font-family:(\s)*('|")([\w-]*\W*)('|")/g.exec(css)[3];
	} catch (err) {
		console.log(`Atlas Data File Error: ${err}`);
	}

	return {
		pathPrefix: "",
		options: [{ name: "Family", value: `"${family}"` }],
	};
}

function generateAssetOptions(type, assetName, extensions) {
	switch (type) {
		case "spritesheet": {
			return generateAssetOptionsSpriteSheet(assetName, extensions);
		}
		case "audiosprites": {
			return generateAssetOptionsAudioSprite(assetName, extensions);
		}
		case "font": {
			return generateAssetOptionsCustomWebFont(assetName, extensions);
		}
	}
	return {};
}

function generateAssetFileDefinition(assetName, extensions) {
	const files = [];
	const _external = undefined;

	for (const extName of extensions) {
		files.push({
			extName: extName,
			assetName: assetName,
		});
	}
	return { files };
}

/**
 * generate asset information object for class export
 * @param { string } name file name
 * @param { Array<string> } extensions file extensions
 */
function generateAssetClassDefinition(assetName, extensions) {
	const className = toPascalCase(assetName.split("/"));
	const type = decideAssetType(assetName, extensions);

	return {
		type,
		assetName,
		className,
		...generateAssetFileDefinition(assetName, extensions),
		...generateAssetOptions(type, assetName, extensions),
	};
}

function dumpAssetClassCode(_className, assets) {
	const s = [];
	if (!assets.length) {
		s.push("");
	} else {
		for (const asset of assets) {
			const _pathPrefix = asset.pathPrefix || "";
			if (asset.files) {
				for (const file of asset.files) {
					// NOTE: Vite JS requires CSS be imported with ?inline
					if (file.extName === "css") {
						// TODO: Use ?inline imports (breaks webfont loader)
						s.push(
							`import ${
								asset.className
							}${file.extName.toUpperCase()} from "public/assets/${file.assetName}.${
								file.extName
							}";`,
						);
					} else {
						s.push(
							`import ${
								asset.className
							}${file.extName.toUpperCase()} from "public/assets/${file.assetName}.${
								file.extName
							}";`,
						);
					}
				}
			}
		}
		s.push("");

		for (const asset of assets) {
			if (asset.enum) {
				s.push("");
				s.push(`  enum ${asset.enum.name}${asset.enum.type} {`);
				for (const value of asset.enum.values) {
					s.push(`    ${value.name} = <any>'${value.value}',`);
				}
				s.push("  }");
				s.push("");
			}
		}

		for (const asset of assets) {
			s.push(`  export class ${asset.className} {`);
			s.push(
				`    static getName(): string { return "${asset.assetName
					.split("/")
					.pop()}"; }`,
			);

			if (asset.options) {
				for (const option of asset.options) {
					s.push(
						`    static get${option.name}(): ${typeof option.value} { return ${
							option.value
						}; }`,
					);
				}
			}

			if (asset.files) {
				for (const file of asset.files) {
					s.push(
						`    static get${file.extName.toUpperCase()}(): string { return ${
							asset.className
						}${file.extName.toUpperCase()}; }`,
					);
				}
			}

			if (asset.enum) {
				s.push("");
				s.push(
					`    static ${asset.enum.type} = ${asset.enum.name}${asset.enum.type}`,
				);
			}
			s.push("  }");
		}
	}
	s.push("");
	return s;
}

// get /asset files with extensions
const pwd = shell.pwd();
shell.cd("./public/assets");
const assetFiles = shell.ls("**/*.*");
const assetTypeList = findAssetTypeList(assetFiles);

// generate asset values for export
const assets = [];
for (const key of Object.keys(assetTypeList)) {
	assets.push(generateAssetClassDefinition(key, assetTypeList[key]));
}

const result = [];
result.push(
	...dumpAssetClassCode(
		"Images",
		assets.filter((asset) => asset.type === "image"),
	),
);
result.push(
	...dumpAssetClassCode(
		"Spritesheets",
		assets.filter((asset) => asset.type === "spritesheet"),
	),
);
result.push(
	...dumpAssetClassCode(
		"Atlases",
		assets.filter((asset) => asset.type === "atlas"),
	),
);
result.push(
	...dumpAssetClassCode(
		"Audio",
		assets.filter((asset) => asset.type === "audio"),
	),
);
result.push(
	...dumpAssetClassCode(
		"Audiosprites",
		assets.filter((asset) => asset.type === "audiosprites"),
	),
);
result.push(
	...dumpAssetClassCode(
		"CustomWebFonts",
		assets.filter((asset) => asset.type === "font"),
	),
);
result.push(
	...dumpAssetClassCode(
		"BitmapFonts",
		assets.filter((asset) => asset.type === "bitmapfont"),
	),
);
result.push(
	...dumpAssetClassCode(
		"JSON",
		assets.filter((asset) => asset.type === "json"),
	),
);
result.push(
	...dumpAssetClassCode(
		"XML",
		assets.filter((asset) => asset.type === "xml"),
	),
);
result.push(
	...dumpAssetClassCode(
		"Text",
		assets.filter((asset) => asset.type === "text"),
	),
);
result.push(
	...dumpAssetClassCode(
		"Scripts",
		assets.filter((asset) => asset.type === "script"),
	),
);
result.push(
	...dumpAssetClassCode(
		"Shaders",
		assets.filter((asset) => asset.type === "shader"),
	),
);
result.push("");

shell.cd(pwd);
shell.rm("-f", ASSET_CLASS_FILE);
shell
	.ShellString(
		"/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */\n\n",
	)
	.to(ASSET_CLASS_FILE);
shell.ShellString(result.join("\n")).toEnd(ASSET_CLASS_FILE);
