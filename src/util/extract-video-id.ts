export function extractVideoID(url: string) {
  try {
    const parsedURL = new URL(url);
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = parsedURL.href.match(regExp);
    return match && match[7].length === 11 ? match[7] : undefined;
  } catch {
    return undefined;
  }
}
