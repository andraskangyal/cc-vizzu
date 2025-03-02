import { commands, Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, env } from "vscode";
import { PageGenerator } from "./pageGen";
import { Summary } from "../data/VSCC_Result";

export class CCVizzuPanel {
    public static currentPanel: CCVizzuPanel | undefined;
    private _pageGen: PageGenerator;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    private _dataTable: any;
    private _dataSummary: any;

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;
        this._panel.onDidDispose(this.dispose, null, this._disposables);
        this._setWebviewMessageListener(this._panel.webview);
        this._pageGen = new PageGenerator(panel, extensionUri);
    }

    public static refresh(data: Object, summ: Summary) {
        if (this.currentPanel != undefined) {
            let refreshReq = this.currentPanel._dataTable != undefined;
            this.currentPanel._dataTable = data;
            this.currentPanel._dataSummary = summ;
            let panel = this.currentPanel._panel;
            panel.reveal(ViewColumn.One);
            if (refreshReq) {
                panel.webview.postMessage({
                    command: 'refresh-data-table',
                    dataTable: data,
                    dataSummary: summ
                });
            }
        }
    }

    public static async render(extensionUri: Uri) {
        if (CCVizzuPanel.currentPanel) {
            CCVizzuPanel.currentPanel._panel.reveal(ViewColumn.One);
        }
        else {
            const panel = window.createWebviewPanel(
                "ccvizzu", "Code Counter Vizzu",
                ViewColumn.One, {
                    enableScripts: true,
            });
            let vizzu = new CCVizzuPanel(panel, extensionUri);
            CCVizzuPanel.currentPanel = vizzu;
            await vizzu._pageGen.generatePage();
            vizzu._panel.webview.html = vizzu._pageGen.getHtmlContent();
        }
    }

    public dispose() {
        CCVizzuPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
            disposable.dispose();
            }
        }
    }

    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;
                const text = message.text;
                switch (command) {
                    case "vizzu-ready":
                        this._panel.webview.postMessage({
                            command: 'refresh-data-table',
                            dataTable: this._dataTable,
                            dataSummary: this._dataSummary
                        });
                        return;
                    case "showinexplorer":
                        let uri = Uri.parse(this._dataSummary.rootDir);
                        uri = Uri.joinPath(uri, text);
                        commands.executeCommand('revealInExplorer', uri);
                        return;
                    case "openlink":
                        env.openExternal(Uri.parse(text));
                        return;
                    case "showinfo":
                        window.showInformationMessage(text);
                        return;
                    case "showerror":
                        window.showErrorMessage(text);
                        return;
                }
            },
            undefined,
            this._disposables
        );
    }
}
