export const b64toBlob = (b64Data: string) => {
  return fetch(b64Data).then((res) => res.blob());
};
