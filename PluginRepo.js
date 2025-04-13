/**
 * @name PluginRepo
 * @author DevilBro
 * @authorId 278543574059057154
 * @version 9.9.9-restored
 * @description Restored PluginRepo for modded clients using BDFDB.
 */

module.exports = (_ => {
	const changeLog = {};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor(meta) { for (let key in meta) this[key] = meta[key]; }
		getName() { return this.name; }
		getAuthor() { return this.author; }
		getVersion() { return this.version; }
		getDescription() {
			return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it.`;
		}

		downloadLibrary() {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200)
					require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ =>
						BdApi.UI.showToast("Downloaded BDFDB Library", { type: "success" })
					);
				else
					BdApi.UI.alert("Error", "Could not download BDFDB Library. Try manually: https://mwittrien.github.io/downloader/?library");
			});
		}

		load() {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue))
				window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, { pluginQueue: [] });

			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.UI.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click download to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: () => { delete window.BDFDB_Global.downloadModal; },
					onConfirm: () => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}

			if (!window.BDFDB_Global.pluginQueue.includes(this.name))
				window.BDFDB_Global.pluginQueue.push(this.name);
		}

		start() { this.load(); }
		stop() {}

		getSettingsPanel() {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		return class PluginRepo extends Plugin {
			onStart() {
				if (BDFDB && BDFDB.PluginUtils && typeof BDFDB.PluginUtils.openPluginRepo === "function") {
					BDFDB.PluginUtils.openPluginRepo(this.name);
				} else {
					BdApi.UI.alert("Plugin Repo", "BDFDB failed to load plugin browser.");
				}
			}
			onStop() {}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(changeLog));
})();
