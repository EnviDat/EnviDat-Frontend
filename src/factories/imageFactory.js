import {checkIsFileAudio, checkIsFileVideo, getFileBaseName, getFileExtension} from './fileFactory';


export const getIcon = (iconName) => {
    const name = getFileBaseName(iconName);

}

/**
* Loads the path to the icon image representing a file extension
*
* @param {string} fileExtension filename or extension of the file
* @return {string|null} relative file path to the icon image file
*/
export const getFileIcon = (fileExtension) => {
    const ext = getFileExtension(fileExtension);
    if(checkIsFileAudio(ext)){
        return getIcon('fileaudio');
    }
    
    if(checkIsFileVideo(ext)){
        return getIcon('filevideo');
    }
    
    return getIcon(`file${ext}`);
};


