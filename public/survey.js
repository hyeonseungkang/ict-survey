const randomId = String(self.crypto.randomUUID()).split('-').pop();
let responseType = '';
let responsed = false;
const mimeType = 'video/mp4';
const chunks = [];
let startDate = Date.now();
let endDate = Date.now();

const randomIdElement = document.querySelector('span#survey-id');
randomIdElement.textContent = randomId;
const logElement = document.querySelector('textarea.log');

const autoDownloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

navigator.mediaDevices.getUserMedia({ video: true }).then(async (stream) => {
  // videoElement.srcObject = stream
  // await videoElement.play()
  // const root = await navigator.storage.getDirectory();
  // const dir = await root.getDirectoryHandle('/videos', {create: true})
  // const fileHandle = await dir.getFileHandle(`${Date.now()}.mp4`, {create: true})
  // const writable = await fileHandle.createWritable()
  const recoder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 6_000_000,
  });
  recoder.ondataavailable = (e) => {
    logElement.textContent += `${recoder.state}&`;
    if (e.data && e.data.size) chunks.push(e.data);
  };
  recoder.onstop = async () => {
    const blob = new Blob(chunks, { type: mimeType });
    // await writable.write(blob)
    // await writable.close()
    autoDownloadBlob(
      blob,
      `${randomId}-${responseType}-${startDate}-${endDate}.mp4`,
    );
    // videoElement.srcObject = null;
    stream.getTracks().forEach((t) => t.stop());
  };
  randomIdElement.addEventListener('click', () => {
    if (!responsed) {
      startDate = Date.now();
      logElement.textContent += `startDate=${startDate}&`;
      recoder.start(1000);
      document
        .querySelector('div.logged')
        .setAttribute('style', 'display: none;');
      document.querySelector('div.main').setAttribute('style', '');
    } else {
      window.location.reload();
    }
  });
  document.querySelectorAll('button.response-btn').forEach((element) => {
    element.addEventListener('click', () => {
      responseType = element.id;
      responsed = true;
      logElement.textContent += `endDate=${endDate}&`;
      logElement.textContent += `responseType=${responseType}&`;
      document.querySelector('div.logged').setAttribute('style', '');
      document
        .querySelector('div.main')
        .setAttribute('style', 'display: none;');
      endDate = Date.now();
      document.querySelector('span#survey-message').textContent =
        '설문을 기록함. 설문ID';
      recoder.stop();
    });
  });
});
