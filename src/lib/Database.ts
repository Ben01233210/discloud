let fileString: string = "";

let lines : String[] = fileString.split('\n')


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

export function initDatabaseString(databaseString: string) {
    fileString = databaseString;
}


export function getBasefile(): Folder {
    let baseFolder : Folder = {name : 'base', path : 'base', parent : null, child : null}
    getSubFolder(baseFolder)

    return baseFolder;
}


export function getSubFolder(ogFolder : Folder): Folder {
    //let folder : Folder = {name : ogFolder.name, path : ogFolder.path, parent : ogFolder.parent, child : []}
    ogFolder.child = []
    let pathArray: String[] = ogFolder.path.split('/')
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
                        getSubFolder(subFolder)
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



export function getSubfiles(filepath: String): String[] {
    let pathArray: String[] = filepath.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    let foundPaths: String[] = []
    while (line < max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            if (pathArray.length - 1 === path) {
                for (let i = line + 1; i <= max; i++) {
                    foundPaths.push(lines[i])
                }
                return(foundPaths)
            } else {
                path += 1
                line += 1
            }
        } else {
            line += folderSize +1
        }
    }
}



export function removeLine(n : number) : void {
    let max = lines.length
    let line = (n - 1)
    while (line < max) {
        lines[line] = lines[line + 1]
        line += 1
    }
    fileString = lines.join('\n')
}



export function deleteFile (filepath : string) : void {
    let pathArray: String[] = filepath.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    let foundPaths: String[] = []
    while (line < max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            if (pathArray.length - 1 === path) {
                for (let i = line; i <= max; i++) {
                    removeLine(line + 1)
                }
                let lastIndex = filepath.lastIndexOf('/');
                let shortendPath = filepath.substring(0, lastIndex)
                shrinkFolderSize(shortendPath, folderSize + 1)
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


export function shrinkFolderSize (filepath : String, amount : number) : void {
    let pathArray: String[] = filepath.split('/')
    let line = 0;
    let max = lines.length;
    let path = 0;
    let foundPaths: String[] = []
    while (line < max) {
        let folderSize = +lines[line].substring(lines[line].lastIndexOf('~') + 1)
        if (lines[line].substring(1, lines[line].lastIndexOf('~')) === pathArray[path]) {
            max = line + folderSize
            let parts = lines[line].split('~')
            let num = +parts[1] - amount
            lines[line] = parts[0] + '~' + num.toString()
            if (pathArray.length - 1 === path) {
                fileString = lines.join('\n')
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


export function getDummyDatabaseContent() {
    return "!base~19\n" +
        "!garten~17\n" +
        "!baum~16\n" +
        "+haus~15\n" +
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
        "!general~0\n" +
        "\n" +
        "\n";
}