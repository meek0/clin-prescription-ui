// STRING
export const appendBearerIfToken = (token?: string) => (token ? `Bearer ${token}` : '');

export const downloadFile = (blob: Blob, filename: string) => {
  const downloadLinkElement = document.createElement('a');
  downloadLinkElement.href = window.URL.createObjectURL(blob);
  downloadLinkElement.download = filename;
  document.body.appendChild(downloadLinkElement);
  downloadLinkElement.click();
  document.body.removeChild(downloadLinkElement);
  URL.revokeObjectURL(downloadLinkElement.href);
};

export const getPositionAt = (value: string, subString: string, index: number) =>
  value.split(subString, index).join(subString).length;
