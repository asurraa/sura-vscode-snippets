import * as vscode from 'vscode'

const jsSnippets = require('../snippets/snippets.json')
const tsSnippets = require('../snippets/ts-snippets.json')

type Snippet = {
  body: Array<string> | string
  description: string
  prefix: Array<string> | string
}

const convertSnippetArrayToString = (snippetArray: Array<string>): string =>
  snippetArray.join('\n')

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "snippet-search" is now active!')
  const disposable = vscode.commands.registerCommand(
    'extension.snippetSearch',
    async () => {
      const javascriptSnippets = Object.entries(jsSnippets as Array<Snippet>)
      const typescriptSnippets = Object.entries(tsSnippets as Array<Snippet>)

      const snippetsArray: Array<[string, Snippet]> =
        javascriptSnippets.concat(typescriptSnippets)

      const items = snippetsArray.map(
        ([shortDescription, { prefix, body, description }], index) => {
          const value = typeof prefix === 'string' ? prefix : prefix[0]

          return {
            id: index,
            description: description || shortDescription,
            label: value,
            value,
            body,
          }
        }
      )

      const options = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Search snippet',
      }

      const snippet = (await vscode.window.showQuickPick(items, options)) || {
        body: '',
      }
      const activeTextEditor = vscode.window.activeTextEditor
      const body =
        typeof snippet.body === 'string'
          ? snippet.body
          : convertSnippetArrayToString(snippet.body)
      activeTextEditor &&
        activeTextEditor.insertSnippet(new vscode.SnippetString(body))
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
