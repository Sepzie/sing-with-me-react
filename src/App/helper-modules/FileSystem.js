async function getNewFileHandle() {
    const options = {
        types: [
            {
                description: 'Text Files',
                accept: {
                    'text/plain': ['.txt'],
                },
            },
            {
                description: 'Lyrics Files',
                accept: {
                    'application/octet-stream': ['.lrc']
                }
            },
        ],
    };

    return await window.showSaveFilePicker(options);
}

async function writeFile(fileHandle, contents) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}

async function readFile() {
    var [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    return [fileHandle, contents]
}

export { getNewFileHandle, writeFile, readFile }