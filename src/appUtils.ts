export const newId = () => {    
    return '_' + Math.random().toString(36).substr(2, 9);
};

export const download = (url: string, fileName: string) => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    anchor.style.display = "none";
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
}
