createBar(1000, {
    apps: 166.6, 
    photos: 166.6, 
    media: 166.6, 
    text: 166.6, 
    other: 166.6
});

function createBar(max, values) {
    let used = 0;
    for(let v in values) used += values[v];
    const storage_container = document.createElement('div');
    storage_container.setAttribute('class', 'sorage-container');
    const storage_used = document.createElement('span');
    storage_used.setAttribute('class', 'storage-used');
    storage_used.innerText = `${(used/1024).toFixed(1)}GB of ${(max/1024).toFixed(1)}GB Used`;
    const storage_bar = document.createElement('div');
    storage_bar.setAttribute('class', 'storage-bar');
    for(let c of ['storage-apps', 'storage-photos', 'storage-media', 'storage-text', 'storage-other']) {
        const s = document.createElement('span');
        const num = values[c.replace('storage-', '')];
        s.style.width = `${(num*100)/max}%`;
        s.setAttribute('class', c);
        storage_bar.appendChild(s);
    }
    const s = document.createElement('span');
    s.setAttribute('class', 'storage-free-space');
    s.style.width = `${((max-used)*100)/max}%`;
    storage_bar.appendChild(s);
    const storage_labels = document.createElement('div');
    storage_labels.setAttribute('class', 'storage-labels');
    for(let l of [['rgb(228, 50, 84)', 'Apps'], ['rgb(228, 192, 8)', 'Photos'], ['rgb(173, 79, 215)', 'Media'], ['rgb(40, 187, 80)', 'Text files'], ['rgb(124, 123, 128)', 'Other'], ['rgb(214, 214, 214)', 'Free space']]) {
        const lab = document.createElement('span');
        const icon = document.createElement('i');
        lab.setAttribute('class', 'storage-label');
        icon.setAttribute('class', 'fa fa-circle storage-label-icon');
        icon.style.color = l[0];
        lab.appendChild(icon);
        lab.innerHTML += ` ${l[1]}`;
        storage_labels.appendChild(lab);
    }
    const storage_left = document.createElement('div');
    storage_left.setAttribute('class', 'storage-used');
    storage_left.innerText = `${((max-used)/1024).toFixed(1)}GB Left`
    storage_container.appendChild(storage_used);
    storage_container.appendChild(storage_bar);
    storage_container.appendChild(storage_labels);
    storage_container.appendChild(storage_left);
    document.body.appendChild(storage_container);
}