import * as googleDriveTransfer from "$lib/googleDriveTransfer";

export const defaultDatabaseString = "!base~0";

export let fileString = ""
let lines : string[] = []

export type _File = {
    name : string
    path : string
    parent : Folder | null

}

export type Folder = {
    name : string
    path : string
    parent : Folder | null
    child: (Folder | _File)[] | null
}

export function setFileString(newFileString: string) {
    fileString = newFileString;
}

export function init(databaseContent: string) {
    fileString = databaseContent;
    lines = databaseContent.split("\n");
}

export async function getBasefile () {
    let baseFolder : Folder = {name : 'base', path : 'base', parent : null, child : null}
    await getSubFolder(baseFolder)
    return(baseFolder)
}

export async function getSubFolder(ogFolder : Folder) {
    //let folder : Folder = {name : ogFolder.name, path : ogFolder.path, parent : ogFolder.parent, child : []}
    ogFolder.child = []
    let pathArray: string[] = ogFolder.path.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    while (line < max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            if (pathArray.length - 1 === path) {
                for (let i = line + 1; i <= max; i++) {
                    if (lines[i].substring(0, 1) === '!') {
                        let subFolderName : string = lines[i].substring(1, lines[i].lastIndexOf('~'))
                        let subFolder : Folder = {                                                                 //hier erstelle ich ein neues folder objekt, für alle 'children' die der original folder hat
                            name: subFolderName,
                            path : ogFolder.path + '/' + subFolderName,
                            parent : ogFolder,
                            child : null
                        };
                        ogFolder.child.push(subFolder)
                        await getSubFolder(subFolder)
                        i += +lines[i].substring(lines[i].lastIndexOf('~') + 1)

                    } else if (lines[i].substring(0, 1) === '+') {
                        let fileName : string = lines[i].substring(1, lines[i].lastIndexOf('~'))
                        let file : _File = {
                            name : fileName,
                            path : ogFolder.path + '/' + fileName,
                            parent : ogFolder
                        };
                        ogFolder.child.push(file)
                        i += +lines[i].substring(lines[i].lastIndexOf('~') + 1)
                    }
                }
                return(ogFolder)
            } else {
                path += 1
                line += 1
            }
        } else {
            line += folderSize +1
        }
    }
}

export async function getSubfiles(filepath: string) {
    let pathArray: string[] = filepath.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    let foundPaths: string[] = []
    while (line < max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            if (pathArray.length - 1 === path) {
                for (let i = line + 1; i <= max; i++) {
                    foundPaths.push(lines[i])
                }
                return foundPaths
            } else {
                path += 1
                line += 1
            }
        } else {
            line += folderSize +1
        }
    }
}

async function removeLine(n : number) {
    let max = lines.length
    let line = (n - 1)
    while (line < max) {
        lines[line] = lines[line + 1]
        line += 1
    }
    fileString = lines.join('\n')
    await googleDriveTransfer.updateDatabaseContent(fileString);
}

export async function deleteFile(filepath : string) {
    let pathArray: string[] = filepath.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    let foundPaths: string[] = []
    while (line < max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            if (pathArray.length - 1 === path) {
                for (let i = line; i <= max; i++) {
                    await removeLine(line + 1)
                }
                let lastIndex = filepath.lastIndexOf('/');
                let shortendPath = filepath.substring(0, lastIndex)
                await shrinkFolderSize(shortendPath, folderSize + 1)
                return
            } else {
                path += 1
                line += 1
            }
        } else {
            line += folderSize +1
        }
    }
}

async function shrinkFolderSize(filepath : string, amount : number) {
    let pathArray: string[] = filepath.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    let foundPaths: string[] = []
    while (line < max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            let parts = lines[line].split('~')
            let num = +parts[1] - amount
            lines[line] = parts[0] + '~' + num.toString()
            if (pathArray.length - 1 === path) {
                fileString = lines.join('\n')
                await googleDriveTransfer.updateDatabaseContent(fileString);
                return
            } else {
                path += 1
                line += 1
            }
        } else {
            line += folderSize +1
        }
    }
}

export async function addFile(name : string, filepath : string, messageIDs : string[]) {
    let pathArray: String[] = filepath.split('/')
    let amount = messageIDs.length + 1
    let line = 0;
    let max = lines.length;
    let path = 0;
    while (line <= max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            let parts = lines[line].split('~')
            let num = +parts[1] + amount
            lines[line] = parts[0] + '~' + num.toString()
            if (pathArray.length - 1 === path) {
                line += 1
                lines.splice(line, 0, '+' + name + '~' + messageIDs.length)
                for (let i = messageIDs.length - 1; i >= 0; i--) {
                    lines.splice(line + 1, 0, messageIDs[i])
                }
                fileString = lines.join('\n')
                await googleDriveTransfer.updateDatabaseContent(fileString);
                return
            } else {
                path += 1
                line += 1
            }
        } else {
            line += folderSize +1
        }
    }
}

export async function addFolder(name : string, filepath : string) {
    let pathArray: string[] = filepath.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    while (line <= max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            let parts = lines[line].split('~')
            let num = +parts[1] + 1
            lines[line] = parts[0] + '~' + num.toString()
            if (pathArray.length - 1 === path) {
                line += 1
                lines.splice(line, 0, '!' + name + '~' + 0)
                fileString = lines.join('\n')
                await googleDriveTransfer.updateDatabaseContent(fileString);
                return
            } else {
                path += 1
                line += 1
            }
        } else {
            line += folderSize +1
        }
    }
}

export const dummyContent =
    "!base~23\n" +
    "!haus~17\n" +
    "!baum~16\n" +
    "+papa~15\n" +
    "abcdefg\n" +
    "abcdef\n" +
    "abcd\n" +
    "abcdefg\n" +
    "abcde\n" +
    "abcdefg\n" +
    "abcdefg\n" +
    "abcdefg\n" +
    "abcdefg\n" +
    "abcde\n" +
    "abcdefg\n" +
    "abcdefg\n" +
    "abcdefg\n" +
    "ab\n" +
    "abcdefg\n" +
    "!general~4\n" +
    "!school~3\n" +
    "+test~2\n" +
    "test\n" +
    "test";


// let messages : string[] = ['1', '2', '3', '4', '5']
// addFile('baumhaus', 'base/general/test', messages)

//addFolder('huette', 'base/grundstueck')

// function adFolder ()



/*
console.log(fileString = fileString.replace('wow', ''))
fs.writeFileSync('test.txt', fileString)
*/

/*
funktionen
- alle dateipfade an frontend (get base file)
- npx ts-node test3.ts
*/
