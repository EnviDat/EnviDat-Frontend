export const extensionsAudioFiles = ['3gp', 'aa', 'aac', 'aax', 'act', 'aiff', 'alac', 'amr', 'ape', 'au', 'awb', 'dss', 'dvf', 'flac', 'gsm', 'iklax', 'ivs', 'm4a', 'm4b', 'm4p', 'mmf', 'movpkg', 'mp3', 'mpc', 'msv', 'nmf', 'ogg', 'oga', 'mogg', 'opus', 'ra', 'rm', 'raw', 'rf64', 'tta', 'voc', 'vox', 'wav', 'wma', 'wv', '8svx', 'cda'];
export const extensionsVideoFiles = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'rrc', 'gifv', 'mng', 'mov', 'avi', 'qt', 'wmv', 'yuv', 'rm', 'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b', 'mod'];

export const normalizePath = (path) => path?.replace(/\\/g, '/') ?? null;

export const getFileName = (path) => normalizePath(path)?.split('/')?.pop() ?? null;

/**
 * Gets base name of a file without the extension
 * @returns null if no base name was found
*/
export const getFileBaseName = (filename) => (/^([\w\-. ]+)\./).exec(getFileName(filename))?.[0] ?? null;

/**
 * Gets the file extension in lower-case, without the period
 * @returns null if no extension was found
 */
export const getFileExtension = (filename) => (/\.([a-z0-9]+)$/).exec(filename?.toLowerCase()?.trim())?.[1] ?? null;

/** Returns the path without its file extension */
export const getExtensionlessPath = (path) => path.replace(`.${getFileExtension(path)}`, ''); 

export const checkIsFileVideo = (filename) => extensionsVideoFiles.includes(getFileExtension(filename) ?? filename);

export const checkIsFileAudio = (filename) => extensionsAudioFiles.includes(getFileExtension(filename) ?? filename);
