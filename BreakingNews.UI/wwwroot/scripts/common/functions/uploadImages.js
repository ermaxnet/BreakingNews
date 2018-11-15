export default function(files) {
    if(!files || files.length < 1) {
        return Promise.reject(new Error("The array of files is empty"));
    }
    const body = new FormData();
    files.forEach(file => body.append(file.name, file));
    return fetch("/Organization/api/media/upload", {
        method: "POST", body
    }).then(response => response.json());
};